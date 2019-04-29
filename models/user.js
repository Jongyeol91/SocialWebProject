const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    ownStudy: String,
    joinStudy: String
});

module.exports = mongoose.model("User", userSchema);

