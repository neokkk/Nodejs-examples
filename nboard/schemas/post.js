const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types: ObjectId } = Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    author: { type: String }
});

module.exports = mongoose.model("Post", postSchema);