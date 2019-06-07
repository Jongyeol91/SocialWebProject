const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    oauthId: String,
    password: String,
    ownStudy: String,
    joinStudy: String,
    provider: String,
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

