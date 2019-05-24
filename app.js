require('dotenv').config();

const express       = require('express'),
      app           = express(),
      ejs           = require('ejs'),
      bodyParser    = require('body-parser'),
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local");
      moment        = require('moment');
      methodOverride = require('method-override'),
      flash         = require('connect-flash'),
      User          = require('./models/user'),
      Study         = require('./models/study'),
      Comment       = require('./models/comment'),
      fs            = require("fs");

// require routes
const commentRoutes  = require('./routes/comments'),
      studyRoutes    = require('./routes/studies'),
      indexRoutes    = require('./routes/index');
      kakaoLocalRoutes      = require('./routes/kakaoLocal');
      
mongoose.connect('mongodb://localhost:27017/studyprojectDB', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); // == express.json() 
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));

// 세션 설정
app.use(require("express-session")({
    secret:"mySecret",
    saveUninitialized: false, // false: 세션이 라이프타임동안 수정된 것이 없으면(초기화되지 않았으면) 저장하지 않는다.
    resave: false
}));
app.use(flash());

// 패스포트 설정
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //User모델에 username과 password있으면 _id를 자동으로 세션등록
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 로컬에 req.user을 항상 담는 미들웨어 => currentUser로 ejs에서도 사용가능해짐
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/study", studyRoutes);
app.use(commentRoutes);
app.use(kakaoLocalRoutes);

app.get("/ajax", (req, res) => {
   fs.readFile('ajax.html', 'utf8', function(err, data){
       if(err){
           console.loge(err);
        }
        console.log(data);
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(data); // html로드
   });
    //res.sendFile(__dirname+ '/ajax.html');
});

app.listen(3000, () => {
    console.log("server has started port on 3000");
});

