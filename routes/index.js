const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Study = require('../models/study');
const User = require('../models/user');
const passport = require('passport');
const moment = require('moment');

router.get("/", (req, res) => {
    Study.find({},(err, studys) => {
        res.render("index.ejs", {studys: studys, moment: moment, currentUser: req.user});
    });
});

//회원가입 창
router.get("/register", (req, res) => {
    res.render("auth/register.ejs");
});

// 회원가입
router.post("/register", (req, res) => {
    let newUser = new User({username : req.body.username});
    let password = req.body.password;
    // register은 passport의 기능
    User.register(newUser, password, (err, user)=>{
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.render("auth/register.ejs");
        }
        // 가입 후 로그인 바로 진행 (id중복은 passport에서 자동 검사)
        passport.authenticate("local")(req, res, () => {
            res.redirect("/");
        });
        // user.save();
    });
});

//로그인 창
router.get("/login", (req, res) => {
    res.render("auth/login.ejs");
});

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login"
}), (req, res) => {
    if(req.session.returnTo){
        res.redirect(req.session.returnTo);
        delete req.session.returnTo;
    } else {
        res.redirect("/");
    }
});

router.get("/logout", (req, res) => {
    delete req.session.returnTo;
    req.flash("success", "성공적으로 로그아웃 되었습니다.");
    req.logOut();
    res.redirect("/");
});

module.exports = router;