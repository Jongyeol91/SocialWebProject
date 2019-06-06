const express = require('express');
const router = express.Router({mergeParams:true});
const Comment = require('../models/comment');
const Study = require('../models/study');
const User = require('../models/user');
const middleware = require('../middleware');

// 세션에서 user._id 가져옴 -> comment모델의 도큐먼트 저장 -> foundStudy에 comment저장
router.post("/study/:id/comment/new", middleware.isLoggedIn, (req, res) => {
    let content = req.body.content;     
    let comment = new Comment({
        author: req.user._id,
        content: content
    });
    
    let studyId = req.params.id;
    comment.save(function(err){
        Study.findById(studyId, (err, foundStudy) => {
            if (err || !foundStudy) {
                req.flash("error", "댓글을 찾지 못했습니다.")
                console.log(err);
            } else {
                foundStudy.comments.push(comment._id);
                foundStudy.save(); 
                res.redirect("/study/" + studyId);
            }   
        });
    });  
});

// 댓글 수정 페이지
router.get("/study/:id/comments/:comment_id/edit", middleware.isCommentOwnerShip, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        res.render("comment/editComment.ejs",
         { foundStudyId: req.params.id, foundComment:foundComment });
    });
});

// 댓글 수정
router.patch("/study/:id/comments/:comment_id/edit", middleware.isCommentOwnerShip, (req, res) => {
    Comment.findOneAndUpdate({ _id: req.params.comment_id },
         { content: req.body.newCommentContent }, { new: true }, (err, newComment) => {
             if(err){
                 console.log(err);
             } else {
                 console.log(newComment);
                 res.redirect("/study/" + req.params.id);
            }
    });
 });

 router.delete("/study/:id/comments/:comment_id/delete", middleware.isCommentOwnerShip, (req, res) => {
    Comment.findOneAndDelete({_id: req.params.comment_id}, (err) => {
        if (err) { 
            res.redirect("/study/" + req.params.id);
            console.log(err);
        } else {
            res.redirect("/study/" + req.params.id);
        } 
    });
 });

module.exports = router;