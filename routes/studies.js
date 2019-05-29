const express = require('express');
const moment = require('moment');
const router = express.Router({ mergeParams: true });
const Comment = require('../models/comment');
const Study = require('../models/study');
const User = require('../models/user');
const middleware = require('../middleware'); // index.js의 파일명은 따로 임포트 해줄 필요가 없음
const controller = require('../controller'); // index.js의 파일명은 따로 임포트 해줄 필요가 없음
 

// 개별 스터디 보기
router.get("/:id", (req, res) => {
    let perPage = 20;
    //Study.findById(req.params.id).populate("user").populate("comments").exec(function(err, foundStudy){
    Study.findById(req.params.id).populate({ path: 'comments', model: Comment, populate: { path: 'author',  model: User }
    }).populate("joinUsers").exec((err, foundStudy) => {
        if (err || !foundStudy) {
            req.flash("error", "스터디를 찾을수 없습니다.");
            res.redirect("/");
        }
            //console.log('foundstudy', foundStudy);
            res.render("study/eachStudy.ejs", { foundStudy: foundStudy, moment: moment });
    });
});

//스터디 만들기 창
router.get("/", (req, res) => {
    if (req.user) {
        res.render("study/makeStudy.ejs");
    } else {
        req.flash("error", "스터디를 만들기 위해 로그인을 먼저 하세요");
        res.redirect("/login");
    }
});

// 스터디 생성
router.post("/", middleware.isLoggedIn, (req, res) => {
    let studyName = req.body.data.studyName;
    let description = req.body.data.description;
    let recruNum =req.body.data.recruNum;
    let img = req.body.data.imgurl;
    let categories = req.body.data.categories;
    let latlngs = req.body.data.latlngs;

    console.log("생성: req.body.data:", req.body.data)
    let author = {
        id: req.user._id,
        username: req.user.username
    };

    studyAddress = controller.makeCustomAddress(latlngs);
    

    let newStudy = {studyName, categories, recruNum, img, description, author, latlngs, studyAddress};
    

    Study.create(newStudy, (err, newlycreated) => {
        if (!err) {
            console.log("새로운 스터디 생성: ", newlycreated);
            req.flash("success", req.user.username+ "님 성공적으로 스터디를 개설했습니다. 퍼팩트 스터디가 응원합니다!");
        } else {
            console.log(err);
        }
        res.redirect("/");
    });
});

// eachStudy에서 오는 ajax 
router.post("/getlatlng", (req, res) => {
    let id = req.body.id;
    Study.findById(id, (err, result) => { 
        res.send(result.latlngs);
     });
});

//index에서 오는 ajax
router.post("/allGetlatlng", (req, res) => {
    Study.find({}, "latlngs", (err, results) => { 
        let arr = [];
        for (let i = 0; i < results.length; i++){
            for (let j = 0; j < results[i].latlngs.length; j++){
                arr.push(results[i].latlngs[j]);
            }
        }
        res.send(arr);
     });
});
    
router.get("/:id/user/new", middleware.isLoggedIn, (req, res) => {
    res.redirect("/");
});

// 스터디 가입 (user을 study에 추가)
router.post("/:id/user/new", middleware.isLoggedIn, (req, res) => {
    let studyId = req.params.id;
    // username은 세션으로 가져옴
    User.findOne({ username: req.user.username }, (err, foundUser) => {
        Study.findById(studyId, (err, foundStudy) => {
            foundStudy.joinUsers.push(foundUser._id);
            foundStudy.save();
        });
    });
    res.redirect("/study/" + studyId);
});

// 스터디 수정 페이지
router.get("/:id/edit", middleware.isOwnerShip, (req, res) => {
    //find()는 배열로 반환
    Study.findById(req.params.id, (err, foundStudy) => {
      res.render("study/editStudy.ejs", { foundStudy: foundStudy, controller: controller });
    });
});

//스터디 수정
router.post("/:id/edit", middleware.isOwnerShip, (req, res) => {
    console.log("req.body.data: ", req.body.data);
    let studyName   = req.body.data.studyName;
    let description = req.body.data.description;
    let recruNum    = req.body.data.recruNum;
    let img         = req.body.data.imgurl;
    let categories  = req.body.data.categories;
    let latlngs     = req.body.data.latlngs;
    let studyAddress = controller.makeCustomAddress(latlngs);
    let data = {studyName:studyName, description:description, recruNum:recruNum, img:img, latlngs:latlngs, categories:categories, studyAddress:studyAddress}

    Study.findOneAndUpdate({_id: req.params.id}, data, (err, updatedStudy) => {
        if(err || !updatedStudy){
            console.log(err);
        } else {
            console.log(updatedStudy);
        }
        res.redirect("/study/" + req.params.id);
    });
});

// 스터디 삭제
router.delete("/:id/delete", middleware.isOwnerShip, (req, res) => {
    Study.deleteOne({_id : req.params.id}, (err) => {
        if(err){
            console.log(err);
            res.redirect("/study/" + req.params.id);
        } else {
            req.flash("success", "성공적으로 삭제했습니다.");
            res.redirect("/");
        }
    });
});


module.exports = router;