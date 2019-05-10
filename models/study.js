const mongoose = require('mongoose');

const studySchema = new mongoose.Schema({
    studyName: String,
    description: String,
    location: String,
    img: String,
    makedDate: { type: Date, default: Date.now },
    joinUsers: [{ type:mongoose.Schema.Types.ObjectId, ref: "User" }], 
    comments: [{type:mongoose.Schema.Types.ObjectId, ref:"Comment"}]
});
module.exports = mongoose.model("Study", studySchema);

// Study.find()
//   .populate([
//     {
//       path: 'comment',
//       select: ['username', 'content']
//     },
//     {
//       path: 'user',
//       select: ['nickname', 'thumbnail']
//     }
//   ])