const mongoose = require('mongoose');
const User = require('./models/user');
const Study = require('./models/study');
mongoose.connect('mongodb://localhost:27017/studyprojectDB', {useNewUrlParser: true});

var study = new Study({
    studyName: "play",
    description: "lets run",
    location: "busan",
    user: user._id
});