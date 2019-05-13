const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Types: ObjectId } = Schema;

const commentSchema = new Schema({
  commenter: {
    type: ObjectId,
    required: true,
    ref: "User"
  },
  commennt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model("Comment", commentSchema);
