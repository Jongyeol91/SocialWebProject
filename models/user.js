const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    oauthId: String,
    provider: String,
    ownStudy: [{ type:mongoose.Schema.Types.ObjectId, ref: "Study" }],
    messages: [{ type:mongoose.Schema.Types.ObjectId, ref: "message" }],
    createdDate: { type: Date, default: Date.now }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

