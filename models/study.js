const mongoose = require('mongoose');
const Comment = require('./comment');

const studySchema = new mongoose.Schema({
    studyName: String,
    description: String,
    location: String,
    img: String,
    makedDate: { type: Date, default: Date.now },
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String
    },
    joinUsers: [{ type:mongoose.Schema.Types.ObjectId, ref: "User" }], 
    comments: [{type:mongoose.Schema.Types.ObjectId, ref:"Comment"}]
});

// studySchema.pre('remove', async function() {
//     await Comment.remove({
//         _id: {
//             $in: this.comments
//         }
//     });
// });

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