const Study = require('../models/study');
const User = require('../models/user');
const passport = require('passport');
const moment = require('moment');
const indexControllerObj = {};

// indexControllerObj.checkCategories = function (){
//     checkboxValueArr = getCheckedCategoriesFor();
//     checkboxValueArr.forEach((e)=>{
//       if( e=== "사기업"){
//         document.getElementById("customCheck1").checked = true
//       } else if (e === "공기업") {
//         document.getElementById("customCheck2").checked = true
//       } else if (e === "인적성") {
//         document.getElementById("customCheck3").checked = true
//       } else if (e === "면접") {
//         document.getElementById("customCheck4").prop("checked", checked);
//       } else if (e === "자소서") {
//         document.getElementById("customCheck5").prop("checked", checked);
//       }
//     });
// };

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

  

module.exports = indexControllerObj
