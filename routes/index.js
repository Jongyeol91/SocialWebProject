const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

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

// ajax로부터 옴
router.post("/checkid", (req, res) => {
  console.log("from checkId header")
  let userID = req.body.userID
  User.findOne({username: userID}, (err, result) => {
    if(result){
      res.send({possibleId: false})
    } else {
      res.send({possibleId: true})
    }
  })
});``

// 개발자 로그인 창
router.get("/managerLogin", (req, res) => {
  res.render("auth/managerLogin.ejs");
});

//로컬 로그인 기능
router.post("/login", indexController.userLogin );

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

// 비빌번호 변경 메일 입력 페이지
router.get("/forgot", (req, res) => {
    res.render("auth/forgot.ejs")
  }
)

// 비밀번호 재설정 메일 보내기
router.post("/forgot", indexController.forgot)

// 비밀번호 재설정 페이지
router.get("/reset/:token", async(req, res) => {
  let foundUser = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gte: Date.now() } })
  if (!foundUser) {
    req.flash("error", "토큰이 유효하지 않거나 비밀번호 변경 기한이 지났습니다.")
    return res.redirect("/")
  }
  res.render("auth/reset.ejs", { token: req.params.token })
})

// 비밀번호 재설정
router.post("/reset/:token", async(req, res) => {
  try {
    foundUser = await User.findOne({ resetPasswordToken: req.params.token })
    await foundUser.setPassword(req.body.data.password)
    foundUser.resetPasswordToken = undefined;
    foundUser.resetPasswordExpires = undefined;
    req.flash("success", "성공적으로 비밀번호를 변경했습니다.")
    res.send()
  } catch (err) {
    console.log(err)
    res.redirect("back")
  }
})

//user info 찾아서 myinfo페이지에 전하는 라우터
router.get("/user/:id", indexController.getUserInfo)

module.exports = router;