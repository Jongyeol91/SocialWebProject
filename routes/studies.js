const express = require('express');
const router = express.Router({ mergeParams: true });
const Comment = require('../models/comment');
const Study = require('../models/study');
const User = require('../models/user');
const middleware = require('../middleware'); // index.js의 파일명은 따로 임포트 해줄 필요가 없음
const NodeGeocoder = require('node-geocoder');
 
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: "AIzaSyA4EcALKivj27CcNiATxnqau5PTsX8fBio",
  formatter: null,
  language:'ko'
};
 
const geocoder = NodeGeocoder(options);

// 개별 스터디 보기
router.get("/:id", (req, res) => {
    //Study.findById(req.params.id).populate("user").populate("comments").exec(function(err, foundStudy){
    Study.findById(req.params.id).populate({
        path: 'comments',
        model: Comment,
        populate: {
            path: 'author',
            model: User
        }
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
        res.redirect("/");
    }
});

// 스터디 생성
router.post("/", middleware.isLoggedIn, (req, res) => {
    const studyName = req.body.data.studyName;
    const description = req.body.data.description;
    const img = req.body.data.imgurl;
    const latlngs = req.body.checkedLocs.map((cv) => {
        return {"lat": cv.lat, "lng": cv.lng}
    });
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newStudy = {studyName: studyName, img: img, description: description, author:author, latlngs:latlngs};
    console.log("newStudy", newStudy);
    
    Study.create(newStudy, (err, newlycreated) => {
        if (!err) {
            console.log("새로운 스터디 생성: ", newlycreated);
        }
        req.flash("success", req.user.username+ "님 성공적으로 스터디를 개설했습니다. 퍼팩트 스터디가 응원합니다!");
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
      res.render("study/editStudy.ejs", { foundStudy: foundStudy });
    });
});

//스터디 수정
router.patch("/:id/edit", middleware.isOwnerShip, (req, res) => {
    Study.findByIdAndUpdate(req.params.id, req.body.study, (err, updatedStudy) => {
        console.log(req.body.study);
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
            req.flash("success", "성공적으로 삭제했습니다.")
            res.redirect("/");
        }
    });
});

// 스터디 조회
router.get("/search", (req, res) => {
    Study.find({
        location: "서울"
    }, (err, foundStudys) => {
        res.render("/index.ejs", {
            foundStudys: foundStudys
        });
    });
});

module.exports = router;