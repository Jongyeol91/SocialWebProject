require('dotenv').config();

const express           = require("express"),
      ejs               = require("ejs"),
      mongoose          = require("mongoose"),
      moment            = require("moment"),
      morgan            = require("morgan"),
      methodOverride    = require("method-override"),
      fs                = require("fs"),
      path              = require("path"),
      expressSession    = require("express-session")
      passport          = require("passport"),
      LocalStrategy     = require("passport-local"),
      GoogleStrategy    = require("passport-google-oauth20").Strategy,
      NaverStrategy     = require("passport-naver").Strategy,
      flash             = require("connect-flash"),
      helmet            = require("helmet");
      
// require routes
const commentRoutes     = require("./routes/comments"),
      studyRoutes       = require("./routes/studies"),
      indexRoutes       = require("./routes/index"),
      kakaoLocalRoutes  = require("./routes/kakaoLocal"),
      authRoutes        = require("./routes/auth"),
      messageRoutes     = require("./routes/message");

const app = express();
      
//mongoose.connect('mongodb://localhost:27017/studyprojectDB', {useNewUrlParser: true});
mongoose.connect(`mongodb+srv://admin-jongyeol:${process.env.mongodb_password}@cluster0-eupih.mongodb.net/studyprojectDB`, {useNewUrlParser: true});

app.use(morgan("common"));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json()) 
app.use(methodOverride("_method"));
app.use(helmet());

// 세션 설정
app.use(expressSession({
    secret:"mySecret",
    saveUninitialized: false, // false: 세션이 라이프타임동안 수정된 것이 없으면(초기화되지 않았으면) 저장하지 않는다.
    resave: false,
    name: "studyproject",
    cookie: {
        httpOnly: true //javascript로 쿠키를 접근할 수 없게한다.
    }
}));
app.use(flash());

// 패스포트 설정
app.use(passport.initialize());
app.use(passport.session());

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
app.use(authRoutes);
app.use(messageRoutes);

const host = '0.0.0.0';

app.listen(5000, () => {
    console.log("server has started");
});


