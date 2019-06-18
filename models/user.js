const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, require: true },
    password: String,
    oauthId: String,
    provider: String,
    resetPasswordToken: String,
    resetPasswordExpires: String,
    email: { type: String, unique: true },
    ownStudy: [{ type:mongoose.Schema.Types.ObjectId, ref: "Study" }],
    messages: [{ type:mongoose.Schema.Types.ObjectId, ref: "message" }],
    createdDate: { type: Date, default: Date.now }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

