const mongoose = require('mongoose');

const studySchema = new mongoose.Schema({
    studyName: String,
    studyAddress: String,
    categories: [],
    recruNum: String,
    description: String,
    latlngs: [],
    img: String,
    makedDate: { type: Date, default: Date.now },
    author: {
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