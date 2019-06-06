const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    oauthId: String,
    password: String,
    ownStudy: String,
    joinStudy: String,
    provider: String,
    point: { type: Number, default: 0, max: 50 }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

