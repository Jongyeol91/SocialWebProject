const mongoose = require('mongoose');
const studySchema = require('./study');
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    oauthId: String,
    provider: String,
    ownStudy: [{ type:mongoose.Schema.Types.ObjectId, ref: "Study" }],
    joinStudy: String,
    point: { type: Number, default: 0, max: 50 },
    message: [{
        messageAuthor: String,
        message: String,
        createdDate: { type: Date, default: Date.now }
    }],
    createdDate: { type: Date, default: Date.now }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

