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

// 댓글 수정
router.get("/study/:id/comments/:comment_id/edit", isCommentOwnerShip, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        res.render("comment/editComment.ejs",
         { foundStudyId: req.params.id, foundComment:foundComment });
    });
});

router.patch("/study/:id/comments/:comment_id/edit", (req, res) => {
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

 router.delete("/study/:id/comments/:comment_id/delete", isCommentOwnerShip, (req, res) => {
    Comment.findOneAndDelete({_id: req.params.comment_id}, (err) => {
        if (err) { 
            res.redirect("/study/" + req.params.id);
            console.log(err);
        } else {
            res.redirect("/study/" + req.params.id);
        } 
    })
 });

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        req.session.returnTo = "/study/" + req.params.id; 
        console.log(req.session.returnTo);
        res.redirect("/login");
    }
}

function isCommentOwnerShip(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findOne({ _id: req.params.comment_id }, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else if (foundComment.author.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
        });
    } else {
        res.redirect("/login");
    }
}

module.exports = router;