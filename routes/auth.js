const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

//User모델에 username과 password있으면 _id를 자동으로 세션등록
passport.use(new LocalStrategy(User.authenticate()));

//asnyc await으로 구현
passport.use(new GoogleStrategy({
  clientID: process.env.google_key,
  clientSecret: process.env.google_password,
  callbackURL: process.env.google_callbackURI_aws
},
async function(accessToken, refreshToken, profile, done) {  
   let user = await User.findOne({'oauthId': profile.id })
      if (err) { 
        return done(err) 
      }
      if (!user) {
        user = new User({
          username: profile.displayName,
          oauthId: profile.id,
          provider: "google",
        });
        await user.save();
        done(err, user);
      } else {
         return done(null, user, { message: '구글 로그인에 성공하였습니다.' }) }
}
));

//promise로 구현
passport.use(new NaverStrategy({
  clientID: process.env.naver_key,
  clientSecret: process.env.naver_password,
  callbackURL: process.env.naver_callbackURI_aws
},
function(accessToken, refreshToken, profile, done) {
  //console.log(profile)
  User.findOne({ "oauthId": profile.id })
    .then((user) => {
      if (!user) {
        user = new User({
          //email: profile.emails[0].value,
          oauthId : profile.id,
          username: profile.displayName,
          provider: 'naver',
        })
        .then(() => {
          user.save();
          done(err, user);
        })
      } else { 
          return done(null, user, { message: "네이버로 로그인에 성공하였습니다." });
        }
    });
}
));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
      done(err, user);
  });
});

//google oauth
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

//google oauth callback
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

//naver oauth
router.get('/auth/naver', 
passport.authenticate('naver', null), function(req, res) {
    console.log('/auth/naver failed, stopped');
});

// naver oauth callback
router.get('/auth/naver/callback', 
passport.authenticate('naver', {
    failureRedirect: '/login'
}), function(req, res) {
    res.redirect('/'); 
});



module.exports = router