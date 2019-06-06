const express = require('express');
const router = express.Router();
const indexController = require('../controller'); // index.js의 파일명은 따로 임포트 해줄 필요가 없음

//전체출력
router.get("/", indexController.getStudies);

// 카테고리 검색결과별 게시판 출력
router.post("/", indexController.getStudiesByCategories);

//회원가입 창
router.get("/register", (req, res) => {
    res.render("auth/register.ejs");
});

// 회원가입
router.post("/register", indexController.userRegister);

//로그인 창
router.get("/login", (req, res) => {
    res.render("auth/login.ejs");
});

router.post("/login",indexController.userLogin );

router.get("/logout", (req, res) => {
    delete req.session.returnTo;
    req.flash("success", "성공적으로 로그아웃 되었습니다.");
    req.logOut();
    res.redirect("/");
});

module.exports = router;