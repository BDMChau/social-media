const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: 'no'
    },
    comment: [{
        text: String,
        by: {
            type: ObjectId,
            ref: 'User'
        }
    }],
    like: [{
        type: ObjectId,
        ref: 'User'
    }],
    by: {
        type: ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

const post = mongoose.model('Post', postSchema);

module.exports = post;