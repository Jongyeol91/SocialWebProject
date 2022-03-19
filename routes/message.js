const express = require('express');
const User = require('../models/user');
const Message = require('../models/message');
const middleware = require('../middleware');
const moment = require('moment');
const router = express.Router({ mergeParams: true });

// 보낸 쪽지, 받은 쪽지 정보 확인 창
router.get('/message/user/:id', (req, res) => {
  User.findById(req.params.id)
    .populate({ path: 'ownStudy', model: 'Study' })
    .populate({ path: 'messages', model: 'Message', options: { sort: { createdDate: -1 } } })
    .exec((err, foundUser) => {
      res.render('myInfo/note.ejs', { foundUser, moment });
    });
});

// 쪽지 입력창
router.get('/message/user/:target_user_id/new', middleware.isLoggedIn, (req, res) => {
  User.findOne({ _id: req.params.target_user_id }).then((targetUser) => {
    res.render('message/makeMessage.ejs', { targetUser, referer: req.headers.referer });
  });
});

// 쪽지 보내기: 보낸사람과 받는사람의 db에 모두 저장
router.post('/message/senduser/:senduserid/targetuser/:targetid/new', (req, res) => {
  let content = req.body.description;
  let messageAuthorId = req.params.senduserid;
  let messageTargetId = req.params.targetid;

  getUser();

  async function getUser() {
    try {
      let messageAuthor = await User.findOne({ _id: messageAuthorId });
      let messageTarget = await User.findOne({ _id: messageTargetId });
      let newMessage = [
        {
          messageAuthor: messageAuthor.username,
          messageTarget: messageTarget.username,
          content,
          messageAuthorId,
          messageTargetId,
        },
      ];
      makeMessage(newMessage);
    } catch (err) {
      console.log(err);
    }
  }

  async function makeMessage(newMessage) {
    try {
      let newlyCreated = await Message.create(newMessage);
      await User.findOneAndUpdate(
        { _id: messageAuthorId },
        { $push: { messages: newlyCreated } },
        { upsert: true }
      ).sort('-createdDate');
      await User.findOneAndUpdate(
        { _id: messageTargetId },
        { $push: { messages: newlyCreated } },
        { upsert: true }
      ).sort('-createdDate');
      req.flash('success', '쪽지를 성공적으로 보냈습니다. 내 정보에서 확인하세요.');
      res.redirect(req.body.referer);
    } catch (err) {
      console.log(err);
      return res.send(500, { error: err });
    }
  }
});

module.exports = router;
