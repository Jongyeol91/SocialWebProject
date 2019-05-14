const Study = require('../models/study');
const Comment = require('../models/comment');
const middlewareObj = {};

middlewareObj.isOwnerShip = function (req, res, next) {
    if (req.isAuthenticated()) {
        Study.findOne({ _id: req.params.id }, (err, foundStudy) => {
            if (err) {
                res.redirect("back");
                console.log("찾기 오류");
            } else if (foundStudy.author.id.equals(req.user._id)) {
                return next();
            } else {
                console.log("다른 회원이 수정하려고 함");
                res.redirect("back");
            }
        });
    } else {
        req.session.returnTo = "/study/" + req.params.id; // path와 originalUrl도 활용가능
        res.redirect("/login");
    }
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.session.returnTo = "/study/" + req.params.id;
        console.log(req.session.returnTo);
        res.redirect("/login");
    }
};

middlewareObj.isCommentOwnerShip = function (req, res, next) {
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
};

module.exports = middlewareObj;