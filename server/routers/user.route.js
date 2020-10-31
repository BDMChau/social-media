const express = require('express');
const route = express.Router();
const postModel = require('../models/post.model');
const userModel = require('../models/user.model');

route.get('/:id', (req, res) => {
    userModel.findOne({ _id: req.params.id })
        .select("-password")
        .then((user) => {
            postModel.find({
                by: req.params.id
            })
                .populate("by", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.json({ err: err })
                    }

                    res.json({ user, posts })
                })
        })
        .catch((err) => {
            return res.json({ err: "user not found!" })
        })
});


route.put('/follow', (req, res) => {
    userModel.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true,
        useFindAndModify: false
    }, (err, result) => {
        if (err) {
            return res.json({ err: err });
        }
        userModel.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId },
        }, {
            new: true,
            useFindAndModify: false
        })
            .select("-password")
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                return res.json({ err: err })
            })
    }
    )
})


route.put('/unfollow', (req, res) => {
    userModel.findByIdAndUpdate(req.body.unFollowId, {
        $pull: { followers: req.user._id }
    }, {
        new: true,
        useFindAndModify: false
    }, (err, result) => {
        if (err) {
            return res.json({ err: err });
        }
        userModel.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unFollowId }
        }, {
            new: true,
            useFindAndModify: false
        })
            .select("-password")
            .exec((err, result) => {
                if (err) {
                    return res.json({ err: err });
                }
                res.json(result);
            })
    }
    )
})

route.put('/avatar', (req, res) => {
    userModel.findByIdAndUpdate(req.user._id, {
        $set: { avatar: req.body.avatar }
    }, {
        new: true,
        useFindAndModify: false
    })
        .exec((err, result) => {
            if (err) {
                return res.json({ err: err })
            }

            return res.json(result);
        })
})

route.put('/removeavatar', (req, res) => {
    userModel.findByIdAndUpdate(req.user._id, {
        $set: { avatar: null }
    }, {
        new: true,
        useFindAndModify: false
    })
        .exec((err, result) => {
            if (err) {
                return res.json({ err: err })
            }

            return res.json(result);
        })
})

route.post('/search', (req, res) => {
    if (req.body.query) {
        const { query } = req.body;
        const pattern = new RegExp("^" + query);

        if (!query) {
            res.json({ users: [] });
        }

        userModel.find({
            $or: [
                { email: { $regex: pattern } },
                { name: { $regex: pattern } }
            ]
        })
            .select("_id email name")
            .exec((err, users) => {
                if (err) {
                    console.log(err);
                }

                if (!users.length) {
                    return res.json({ users: ["Nothing like that :("] })
                }

                res.json({ users: users });
            })
    }
})


module.exports = route;

