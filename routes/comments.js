const express = require('express');
const router = express.Router({mergeParams:true});
const Comment = require('../models/comment');
const Study = require('../models/study');
const User = require('../models/user');

// 댓글생성 라우터 //
// 세션에서 user._id 가져옴 -> comment모델의 도큐먼트 저장 -> foundStudy에 comment저장
router.post("/study/:id/comment/new", isLoggedIn, (req, res) => {
    let content = req.body.content;     
    let comment = new Comment({
        author: req.user._id,
        content: content
    });
    
    let studyId = req.params.id;
    comment.save(function(err){
        Study.findById(studyId, (err, foundStudy) => {
            if (err) {
                console.log(err);
            } else {
                foundStudy.comments.push(comment._id);
                foundStudy.save(); 
                console.log(comment.author, "댓글을 스터디 모델에 저장 완료")
                res.redirect("/study/" + studyId);
            }   
        });
    });  
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) return next();
    else res.redirect("/login");
}

module.exports = router;