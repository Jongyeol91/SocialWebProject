const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Study = require('../models/study');
const User = require('../models/user');
const passport = require('passport');
const moment = require('moment');

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

// creates an account if no account of the new user
router.get('/auth/naver/callback', 
passport.authenticate('naver', {
    failureRedirect: '/login'
}), function(req, res) {
    res.redirect('/'); 
});

module.exports = router