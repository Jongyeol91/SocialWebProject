const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const NaverStrategy = require('passport-naver').Strategy;

// User모델에 username과 password있으면 _id를 자동으로 세션등록
passport.use(new LocalStrategy(User.authenticate()));

// asnyc await으로 구현
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.google_key,
      clientSecret: process.env.google_password,
      callbackURL: process.env.google_callbackURI,
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ oauthId: profile.id }).then((user) => {
        if (!user) {
          user = new User({
            username: profile.displayName,
            oauthId: profile.id,
            provider: 'google',
          }).then(() => {
            user.save();
            done(err, user);
          });
        } else {
          return done(null, user);
        }
      });
    }
  )
);

//promise로 구현
passport.use(
  new NaverStrategy(
    {
      clientID: process.env.naver_key,
      clientSecret: process.env.naver_password,
      callbackURL: process.env.naver_callbackURI,
    },
    function (accessToken, refreshToken, profile, done) {
      //console.log(profile)
      User.findOne({ oauthId: profile.id }).then((user) => {
        if (!user) {
          user = new User({
            //email: profile.emails[0].value,
            oauthId: profile.id,
            username: profile.displayName,
            provider: 'naver',
          }).then(() => {
            user.save();
            done(err, user);
          });
        } else {
          return done(null, user, { message: '네이버로 로그인에 성공하였습니다.' });
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//google oauth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

//google oauth callback
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  }
);

//naver oauth
router.get('/auth/naver', passport.authenticate('naver', null), function (req, res) {
  console.log('/auth/naver failed, stopped');
});

// naver oauth callback
router.get(
  '/auth/naver/callback',
  passport.authenticate('naver', {
    failureRedirect: '/login',
  }),
  function (req, res) {
    res.redirect('/');
  }
);

// 노드메일러
// import nodemailer from 'nodemailer';

// router.get('/mail', async(req, res) => {
//     const smtpTransport = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: 'ID@gmail.com',
//             pass: 'PW'
//         }
//     })

//     const mailOptions = {
//         from: '보내는 메일',
//         to: '받는 메일',
//         subject: '제목',
//         //text: '내용'
//         html: '<h1>HTML Test<h1><p><img src="https://postfiles.pstatic.net/MjAxODEyMzFfMTk1/MDAxNTQ2MjMyNjU4NDc3.apeLcP_BEpVEj0z6SvTebsUGG8DJTbTSZmdHgNH82h4g.mHNubV6TsVtEEUt8ufphzKleSvQOTENsNTaxzqWeFgog.JPEG.dilrong/Screenshot_2018-12-31_at_13.55.57.jpg?type=w773"/></p>'
//     };

//     await smtpTransport.sendMail(mailOptions, (error, responses) =>{
//         if(error){
//             res.json(err);
//         }else{
//             res.json(sucess);
//         }
//         smtpTransport.close();
//     });
// });

module.exports = router;
