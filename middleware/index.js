const Study = require('../models/study');
const Comment = require('../models/comment');
const middlewareObj = {};

middlewareObj.isOwnerShip = function (req, res, next) {
    if (req.isAuthenticated()) {
        Study.findOne({ _id: req.params.id }, (err, foundStudy) => {
            if (err || !foundStudy) {
                console.log(err);
                res.redirect("back");
            } else if (foundStudy.author.id.equals(req.user._id)) {
                return next();
            } else {
                req.flash("error", "스터디 수정 권한이 없습니다.");
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
        req.flash("success", req.user.username + "님 환영합니다.");
        return next();
    } else {
        req.flash("error", "로그인을 먼저 하십시오");
        req.session.returnTo = "/study/" + req.params.id;
        res.redirect("/login");
    }
};

middlewareObj.isCommentOwnerShip = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findOne({ _id: req.params.comment_id }, (err, foundComment) => {
            if (err) {
                req.flash("error", "찾는 스터디가 없습니다");
                res.redirect("back");
            } else if (foundComment.author.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "권한이 없습니다.");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "로그인을 하세요.");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;