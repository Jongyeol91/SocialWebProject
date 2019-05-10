const express = require('express');
const router = express.Router({mergeParams:true});
const Comment = require('../models/comment');
const Study = require('../models/study');
const User = require('../models/user');

// 개별 스터디 보기
router.get("/:id", (req, res) => {
    //Study.findById(req.params.id).populate("user").populate("comments").exec(function(err, foundStudy){
    Study.findById(req.params.id).populate({
         path:'comments', model:Comment, populate: { 
            path:'author', model:User
        }}).populate("joinUsers").exec((err, foundStudy) => {  
            //console.log('foundstudy', foundStudy);
            res.render("eachStudy.ejs", {foundStudy:foundStudy, moment:moment});
        });     
});

//스터디 만들기 창
router.get("/", (req, res) => {
    res.render("makeStudy.ejs");
});

// 스터디 생성
router.post("/", isLoggedIn, (req, res) => {
    let studyName = req.body.studyName;
    let discription = req.body.discription;
    let location = req.body.location;
    let img = req.body.imgurl;
    let author = {
        id: req.user._id,
        username: req.user.username
    }; 

    let newStudy = new Study({
        studyName: studyName,
        img: img,
        description: discription,
        location: location,
        author: author
    });
    Study.create(newStudy, (err, newlycreated) => {
        if(!err){
            console.log("새로운 스터디 생성: ", newlycreated);
        }
        res.redirect("/");
    });
});

// 스터디 가입 (user을 study에 추가)
router.post("/:id/user/new", (req, res) => {
    let studyId = req.params.id;
    // username은 세션으로 가져옴
    User.findOne({username: req.user.username}, (err, foundUser) => {
        Study.findById(studyId, (err, foundStudy)=>{
            foundStudy.joinUsers.push(foundUser._id);
            foundStudy.save();
        });
    });
    res.redirect("/study/" + studyId);
});

//조회
router.get("/search", (req, res) => {
    Study.find({location: "서울"}, (err, foundStudys) => {
        res.render("/index.ejs", {foundStudys: foundStudys});
    });
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) 
        return next();
    else res.redirect("/login");
}

module.exports = router;