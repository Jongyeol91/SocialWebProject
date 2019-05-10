const express       = require('express'),
      ejs           = require('ejs'),
      bodyParser    = require('body-parser'),
      app           = express(),
      User          = require('./models/user'),
      Study         = require('./models/study'),
      Comment       = require('./models/comment'),
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local");
      moment        = require('moment');

const commentRoutes  = require('./routes/comments'),
      studyRoutes    = require('./routes/studies'),
      indexRoutes    = require('./routes/index');
      
mongoose.connect('mongodb://localhost:27017/studyprojectDB', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

// 세션 설정
app.use(require("express-session")({
    secret:"mySecret",
    saveUninitialized: false, // false: 세션이 라이프타임동안 수정된 것이 없으면(초기화되지 않았으면) 저장하지 않는다.
    resave: false
}));

// 패스포트 설정
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //User모델에 username과 password있으면 _id를 자동으로 세션등록
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// res에 req.user을 항상 담는 미들웨어
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use("/study", studyRoutes);
app.use(commentRoutes);

app.listen(3000, () => {
    console.log("server has started port on 3000");
});

