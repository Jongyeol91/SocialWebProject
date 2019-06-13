const express = require('express');
const router = express.Router();
const passport = require("passport")
const indexController = require('../controller'); // index.js의 파일명은 따로 임포트 해줄 필요가 없음

//전체출력
router.get("/", indexController.getStudies);

// 카테고리 검색결과별 게시판 출력
router.post("/", indexController.getStudiesByCategories);

//회원가입 창
router.get("/register", (req, res) => {
    res.render("auth/register.ejs");
});

// 로컬 회원가입
router.post("/register", indexController.userRegister);

//로컬 로그인 창
router.get("/login", (req, res) => {
    res.render("auth/login.ejs");
});

// 개발자 로그인 창
router.get("/managerLogin", (req, res) => {
  res.render("auth/managerLogin.ejs");
});

// 로컬 로그인 기능
//router.post("/login", indexController.userLogin );

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get("/logout", (req, res) => {
    delete req.session.returnTo;
    req.flash("success", "성공적으로 로그아웃 되었습니다.");
    req.logOut();
    res.redirect("/");
});

//user info 찾아서 myinfo페이지에 전하는 라우터
router.get("/user/:id", indexController.getUserInfo)

module.exports = router;