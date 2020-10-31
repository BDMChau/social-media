const express = require('express');
const route = express.Router();
const postModel = require('../models/post.model');
const userModel = require('../models/user.model');

//////////////
route.get('/explorer', (req, res) => {
    postModel.find()
        .populate("by", "_id name avatar")
        .populate("comment.by", "_id name")
        .sort('-createdAt')
        .exec((err, posts) => {
            if (err) {
                console.log(err);
            }
            res.json({ posts })
        })
})

route.get('/followedposts', (req, res) => {
    postModel.find({ by: { $in: req.user.following } })
        .populate("by", "_id name avatar")
        .populate("comment.by", "_id name")
        .sort('-createdAt')
        .exec((err, posts) => {
            if (err) {
                console.log(err);
            }
            res.json({ posts })
        })
})

route.post('/user', (req, res) => {
    userModel.findOne({
        _id: req.body.userId
    })
        .exec((err, user) => {
            if (err) {
                console.log(err);
            }
            res.json({ user })
        })
})

route.get('/mywall', (req, res) => {
    postModel.find({
        by: req.user._id
    })
        .populate("by", "_id name")
        .populate("comment.by", "_id name")
        .exec((err, myposts) => {
            if (err) {
                console.log(err);
            }
            res.json({ myposts })
        })

})

route.post('/newpost', (req, res) => {
    const { body, photo } = req.body;

    const newPost = new postModel({
        body: body,
        photo: photo,
        by: req.user
    })

    newPost.save()
        .then((data) => {
            res.json({ newPost: data })
        })
        .catch((err) => {
            console.log(err);
        })
})

route.put('/like', (req, res) => {
    postModel.findByIdAndUpdate(req.body.postId, {
        $push: { like: req.user._id }
    }, {
        new: true,
        useFindAndModify: false
    })
        .populate("by", "_id name")
        .populate("comment.by", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.json({ err: err });
            }
            res.json(result);
        })
})

route.put('/unlike', (req, res) => {
    postModel.findByIdAndUpdate(req.body.postId, {
        $pull: { like: req.user._id }
    }, {
        new: true,
        useFindAndModify: false
    })
        .populate("by", "_id name")
        .populate("comment.by", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.json({ err: err });
            }
            res.json(result);
        })
})

route.put('/comment', (req, res) => {
    const comment = {
        text: req.body.text,
        by: req.user._id
    }

    postModel.findByIdAndUpdate(req.body.postId, {
        $push: { comment: comment }
    }, {
        new: true,
        useFindAndModify: false
    })
        .populate("by", "_id name")
        .populate("comment.by", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.json({ err: err });
            }
            res.json(result);
        })
})

route.delete('/remove/:postId', (req, res) => {
    postModel.findById(req.params.postId)
        .populate("by", "_id")
        .exec((err, removePost) => {
            if (err || !removePost) {
                return res.json({ err: err });
            }

            if (removePost.by._id.toString() === req.user._id.toString()) {
                removePost.remove()
                    .then((removedPost) => {
                        res.json(removedPost);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
})


module.exports = route