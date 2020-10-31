const express = require('express');
const route = express.Router();
const keys = require('../config/key');
const userModel = require('../models/user.model');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

/////////////
const mailer = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: keys.SENDGRID_KEY
    }
}))

/////////////
route.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ err: "Please fill in all fields!" })
    }

    userModel.findOne({
        email: email
    })
        .then((user) => {
            if (user) {
                return res.json({ err: "Email is already exists!" })
            }

            bcryptjs.hash(password, 8)
                .then((hashedpassword) => {
                    const newUser = new userModel({
                        name: name,
                        email: email,
                        password: hashedpassword
                    })
                    newUser.save()
                        .then((newUser) => {
                            mailer.sendMail({
                                to: newUser.email,
                                from: "bdmchau10005@gmail.com",
                                subject: "Welcome",
                                html: "<h1>Welcome to social media!</h1>"
                            })
                            res.json({ msg: "Created new account successfully!", msg2: "Now you can login!" })
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })

        })
        .catch((err) => {
            console.log(err);
        })

})

route.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.json({ err: "Missing credentials!" })
    }

    userModel.findOne({
        email: email
    })
        .then((user) => {
            if (!user) {
                return res.json({ err: "Email does not exist!" })
            }

            bcryptjs.compare(password, user.password)

                .then((isMatch) => {
                    if (!isMatch) {
                        return res.json({ err: "Invalid password!" })
                    }

                    const userToken = jwt.sign({ _id: user._id }, keys.JWT_SECRET, { algorithm: 'HS256' });

                    const { _id, name, email, followers, following, avatar } = user;
                    res.json({
                        userToken,
                        user: { _id, name, email, followers, following, avatar },
                        msg: "Welcome"
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
})

route.post('/sendemail', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString("hex");

        userModel.findOne({ email: req.body.email })
            .exec((err, user) => {
                if (err) {
                    console.log(err);
                }

                if (!user) {
                    return res.json('Email does not exist!')
                }

                user.resetToken = token;
                user.expireToken = Date.now() + 1800000; //30 minutes
                user.save()
                    .then((result) => {
                        mailer.sendMail({
                            to: result.email,
                            from: "bdmchau10005@gmail.com",
                            subject: "Reset password!",
                            html: `
                                <h2>Reset password</h2>
                                <p>Click <a href="http://localhost:3000/resetpass/${token}">this</a> to reset your password!</p>
                                <br/>
                                <p>This action will be expired in 30 minutes</p>
                            `
                        })

                        res.json('A mail is sent, please check your email!');
                    })
                    .catch((err) => {
                        return res.json({ err: err })
                    })


            })
    })
})

route.post('/resetpassword', (req, res) => {
    const newPassword = req.body.newPass;
    const token = req.body.tokenReset;

    userModel.findOne({
        resetToken: token,
        expireToken: { $gt: Date.now() } // check expire 
    })
        .exec((err, user) => {
            if (err) {
                console.log(err);
            }

            if (!user) {
                return res.json({ err: 'Please try again, your request is expired!' })
            }

            bcryptjs.hash(newPassword, 8)
                .then((hashedPassword) => {
                    user.password = hashedPassword;
                    user.tokenReset = undefined;
                    user.expireToken = undefined;

                    user.save()
                        .then((user) => {
                            res.json({ msg: "Password is updated!" })
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        })
})

module.exports = route;