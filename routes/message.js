const express = require("express");
const User = require("../models/user");
const Message = require("../models/message");
const middleware = require('../middleware');
const router = express.Router({ mergeParams: true });

router.get("/message/user/:target_user_id/new", middleware.isLoggedIn, (req, res) => {
 
        User.findOne({_id: req.params.target_user_id})
        .then((targetUser) => {
            res.render("message/makeMessage.ejs", { targetUser });
        })
 
        
    
})

// 쪽지 보내기: 보낸사람과 받는사람의 db에 모두 저장
router.post("/message/senduser/:senduserid/targetuser/:targetid/new", (req, res) => {
    let content = req.body.description;
    let messageAuthor = req.params.senduserid;
    let messageTarget = req.params.targetid;
 
    let newMessage = { content, messageAuthor, messageTarget }

    makeMessage();

    async function makeMessage(){
        try {
            let newlyCreated = await Message.create(newMessage)
            await User.findOneAndUpdate({ _id: messageAuthor }, { $push:{ messages: newlyCreated }}, {upsert: true})
            await User.findOneAndUpdate({ _id: messageTarget }, { $push:{ messages: newlyCreated }}, {upsert: true})
            res.redirect("back")
        } catch (err) {
            console.log(err)
            return res.send(500, { error: err });
        }
    }
})  

module.exports = router;

