const mongoose = require('mongoose');

const studySchema = new mongoose.Schema({
    studyName: String,
    description: String,
    location: String,
    user: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }] 
});
module.exports = mongoose.model("Study", studySchema);