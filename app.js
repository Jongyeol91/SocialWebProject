const express       = require('express'),
      ejs           = require('ejs'),
      bodyParser    = require('body-parser'),
      app           = express(),
      User          = require('./models/user'),
      Study         = require('./models/study'),
      mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost:27017/studyprojectDB', {useNewUrlParser: true});

//메인
app.get("/", (req, res) => {
    Study.find({},(err, studys) => {
        res.render("index.ejs", {studys: studys});
    });
});

// 개별 스터디 보기
app.get("/study/:id", (req, res) => {
    Study.findById(req.params.id).populate("user").exec(function(err, foundStudy){
        console.log(req.params.id);
        console.log(foundStudy);
    });
});

//스터디 만들기 창
app.get("/study", (req, res) => {
    res.render("makeStudy.ejs");
});

//유저 만들기 창
app.get("/user", (req, res) => {
    res.render("makeUser.ejs");
});

// 회원가입
app.post("/user", (req, res) => {
    let username = req.body.username;
    let user = new User({
        username: username,
        ownStudy: "없음",
        joinStudy: "없음"
    }); 
    user.save();
    res.redirect("/")
});

// 스터디 생성
app.post("/study", (req, res) => {
    let studyName = req.body.studyName;
    let discription = req.body.discription;
    let location = req.body.location;

    let newStudy = new Study({
        studyName: studyName,
        description: discription,
        location: location,
        //user: user._id
    });
    Study.create(newStudy, (err, newlycreated) => {
        if(!err){
            console.log("새로운 스터디 생성: ", newlycreated);
        }
        res.redirect("/");
    });
});

// 스터디 가입 (user을 study에 추가)
app.post("/study/:id/enter", (req, res) => {
    studyId = req.params.id;
    // username은 세션으로 가져옴
    User.findOne({username: "kim"}, (err, foundUser) => {
        // Study.findByIdAndUpdate(studyId, {user : foundUser._id}, {new:true}, function(err, changedStudy){
        //     if(changedStudy){
        //         console.log(changedStudy);
        //     } else {
        //         console.log("안바뀜");
        //     }
        // });
        Study.findById(req.params.id, (err, foundStudy)=>{
            foundStudy.user.push(foundUser);
            foundStudy.save();
        });
    });
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("server has started port on 3000");
});

