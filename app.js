require('dotenv').config();

const express       = require('express'),
      app           = express(),
      ejs           = require('ejs'),
      bodyParser    = require('body-parser'),
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      moment        = require('moment'),
      fs            = require("fs"),
      path          = require("path"),
      methodOverride = require('method-override'),
      flash         = require('connect-flash'),
      User          = require('./models/user'),
      Study         = require('./models/study'),
      Comment       = require('./models/comment'),
      GoogleStrategy = require('passport-google-oauth20').Strategy,
      NaverStrategy = require('passport-naver').Strategy;

      
// require routes
const commentRoutes     = require('./routes/comments'),
      studyRoutes       = require('./routes/studies'),
      indexRoutes       = require('./routes/index'),
      kakaoLocalRoutes  = require('./routes/kakaoLocal'),
      authRoutes  = require('./routes/auth');
      
//mongoose.connect('mongodb://localhost:27017/studyprojectDB', {useNewUrlParser: true});
mongoose.connect(`mongodb+srv://admin-jongyeol:${process.env.mongodb_password}@cluster0-eupih.mongodb.net/studyprojectDB`, {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); // == express.json() 
app.use(express.static(path.join(__dirname, '/public')));
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


passport.serializeUser(function (user, done) {
    done(null, user._id);
    console.log(user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
passport.use(new LocalStrategy(User.authenticate())); //User모델에 username과 password있으면 _id를 자동으로 세션등록
passport.use(new GoogleStrategy({
    clientID: process.env.google_key,
    clientSecret: process.env.google_password,
    callbackURL: process.env.google_callbackURI
},
function(accessToken, refreshToken, profile, done) {  
    User.findOne({'oauthId': profile.id }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            user = new User({
                username: profile.displayName,
                oauthId: profile.id,
                provider: "google",
            });
            user.save((err) => {
                if (err) {
                    console.log('save err', err);
                }
                return done(err, user);
            });
        } else {
            return done(err, user);
        }
    });
    }
));

passport.use(new NaverStrategy({
    clientID: process.env.naver_key,
    clientSecret: process.env.naver_password,
    callbackURL: process.env.naver_callbackURI
},
function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    User.findOne({ "oauthId": profile.id }, function(err, user) {
        if (!user) {
            user = new User({
                //email: profile.emails[0].value,
                oauthId : profile.id,
                username: profile.displayName,
                provider: 'naver',
            });
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            
            return done(err, user);
        }
    });
}
));

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

app.get('/cool', (req, res) => res.send(cool()))

const port = process.env.PORT || 5000;
const host = '0.0.0.0';

app.listen( port, host, () => {
    console.log("server has started port on 3000");
});


