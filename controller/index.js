const Study = require('../models/study');
const User = require('../models/user');
const passport = require('passport');
const moment = require('moment');
const crypto = require('crypto');
const nodemailer = require("nodemailer")
const indexControllerObj = {};

indexControllerObj.getStudies = (req, res) => {
  const perPage = 20;
  const pageQuery = parseInt(req.query.page);
  const pageNumber = pageQuery ? pageQuery : 1;
  
  Study.find({}).sort('-makedDate').skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, studys) {
      Study.countDocuments().exec(function (err, count) {
          if (err) {
              console.log(err);
          } else {
              res.render("index.ejs", { studys, moment, currentUser: req.user, current: pageNumber, pages: Math.ceil(count / perPage) });
          }
      });
  });
}

// 페이지 네이션
indexControllerObj.getStudiesByCategories = (req, res) => {
  const perPage = 20;
  const pageQuery = parseInt(req.query.page);
  const pageNumber = pageQuery ? pageQuery : 1;
  
  option =  { categories: { $in: req.body.searchCategories }}; // 검색옵션(하나라도 포함하면 출력)
 
  Study.find(option).sort('-makedDate').skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, studys) {
      Study.countDocuments().exec(function (err, count) {
          if (err) {
              console.log(err);
          } else {
              res.render("index.ejs", { studys, moment, currentUser: req.user, current: pageNumber, pages: Math.ceil(count / perPage) });
          }
      });
  });
}

//로컬 회원등록
indexControllerObj.userRegister = (req, res) => {
    console.log(req.body.data)
  let newUser = new User({username: req.body.data.username, email: req.body.data.email});
  let password = req.body.data.password;
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
       user.save();
  });
}

// 로컬 로그인
indexControllerObj.userLogin = passport.authenticate("local", {
 
  failureRedirect: "/login",
  //failureFlash:true,
  //successFlash:true

}), (req, res) => {
  if(req.session.returnTo){
      res.redirect(req.session.returnTo);
      delete req.session.returnTo;
  } else {
      res.redirect("/");
  }
}

//user info 찾아서 myinfo페이지에 전하는 메서드
indexControllerObj.getUserInfo = (req, res) => {
    //유저한명을 찾고 개설한 스터디와 합친후 결과 반환
    User.findById(req.params.id)
    .populate({path:"ownStudy", model: "Study"})
    .populate({path:"messages", model: "Message", options: { sort: { "createdDate": -1 } }})
    .exec((err, foundUser) => {
        res.render("myInfo/myInfo.ejs", { foundUser, moment })
    })
}   

// 노드메일러를 활용하여 비밀번호 변경 메일 보내기
indexControllerObj.forgot = (req, res) => {

        sendEmail()
          async function sendEmail (){
              var buf =  crypto.randomBytes(20)
              var token = buf.toString('hex')
           
            try {
              try {
                var user = await User.findOne({email: req.body.email})
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000 //1시간
                await user.save()
                console.log(user)
              }catch(err){
                console.log(err)
                req.flash("error", "등록된 이메일이 없습니다.")
                return res.redirect("/forgot")
              }
      
              try {
                var smtpTransport = nodemailer.createTransport({
                port: 587,
                secure: false,
                service:"Gmail",
                auth:{
                  user: "pjr159@gmail.com",
                  pass: process.env.googlePW
                }
              });
              
                await smtpTransport.sendMail({
                  from: "pjr159@gmail.com",
                  to: user.email,
                  subject: "우리동네 스터디 비밀번호 변경",
                  html: 
                  `<div>
                  <p>회원님께서는 우리동네 스터디의 비밀번호 변경을 요청하셨기에 이 링크를 받았습니다. 
                  링크를 클릭하시면 비밀번호 변경 창으로 이동합니다.</p>
                  <p>만약 비밀번호 변경을 요청하신 적이 없으면 이 메일을 무시하시면 됩니다.</p>
                  <Strong><a href="http://${req.headers.host}/reset/${token}">비밀번호 변경하기 </a></Strong>
                  </div>`
                })
                req.flash("success", `이메일을 ${user.email}의 주소로 보냈습니다.`)
                res.redirect("/forgot")
              } catch(err) {
                console.log("보내기 실패", err)
                  res.redirect("/forgot")
              }
            } catch(e) {
              console.log("전체 에러", e)
            }
          }
      }


  

module.exports = indexControllerObj
