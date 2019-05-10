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
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// res에 req.user을 항상 담는 미들웨어
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get("/", (req, res) => {
    Study.find({},(err, studys) => {
        res.render("index.ejs", {studys: studys, currentUser: req.user});
    });
});

// 개별 스터디 보기
app.get("/study/:id", (req, res) => {
    //Study.findById(req.params.id).populate("user").populate("comments").exec(function(err, foundStudy){
    Study.findById(req.params.id).populate({
         path:'comments', model:Comment, populate: { 
            path:'author', model:User
        }}).populate("joinUsers").exec((err, foundStudy) => {  
            //console.log('foundstudy', foundStudy);
            res.render("eachStudy.ejs", {foundStudy:foundStudy, moment:moment});
        });     
});

//스터디 만들기 창
app.get("/study", (req, res) => {
    res.render("makeStudy.ejs");
});

//회원가입 창
app.get("/register", (req, res) => {
    res.render("register.ejs");
});

// 회원가입
app.post("/register", (req, res) => {
    let newUser = new User({username : req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            console.log(err);
            res.render("register.ejs");
        }
        // 가입 후 로그인 바로 진행(id중복 자동 검사)
        passport.authenticate("local")(req, res, () => {
            res.redirect("/");
        });
        // user.save();
    });
});

//로그인 창
app.get("/login", (req, res) => {
    res.render("login.ejs")
});

app.post("/login", passport.authenticate("local", {
    successRedirect:"/",
    failureRedirect:"login"
}), (req, res) => {
});

app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
});

// 스터디 생성
app.post("/study", (req, res) => {
    let studyName = req.body.studyName;
    let discription = req.body.discription;
    let location = req.body.location;
    let img = req.body.imgurl;

    let newStudy = new Study({
        studyName: studyName,
        img: img,
        description: discription,
        location: location,
        //user: user._id
    });
    Study.create(newStudy, (err, newlycreated) => {
        if(!err){
            console.log("새로운 스터디 생성: ", newlycreated);
        }
        res.redirect("/");
    });
});

// 스터디 가입 (user을 study에 추가)
app.post("/study/:id/user/new", (req, res) => {
    let studyId = req.params.id;
    // username은 세션으로 가져옴
    User.findOne({username: req.body.username}, (err, foundUser) => {
        Study.findById(req.params.id, (err, foundStudy)=>{
            foundStudy.joinUsers.push(foundUser._id);
            foundStudy.save();
        });
    });
    res.redirect("/study/" + studyId);
});

// 댓글생성 라우터
app.post("/study/:id/comment/new", isLoggedIn, (req, res) => {
    let studyId = req.params.id;
    let content = req.body.content;
    
    // 댓글생성(user._id 포함)
    //passport의 세션에서 등록해준 req.user에서 이름 받아옴. 
    User.findOne({username:req.user.username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            let comment = new Comment({
                author: foundUser._id,
                content: content
            });
            comment.save(function(err){
                Study.findById(studyId, (err, foundStudy) => {
                    if (err) {
                        console.log(err);
                    } else {
                        foundStudy.comments.push(comment._id);
                        foundStudy.save(); 
                        console.log(comment.author, "댓글을 스터디 모델에 저장 완료")
                        res.redirect("/study/" + studyId);
                    }   
                });// Study.findById 
            }); 
        } // else  
    });// User.findOne         
});

//조회
app.get("/search", (req, res) => {
    Study.find({location: "서울"}, (err, foundStudys) => {
        res.render("/index.ejs", {foundStudys: foundStudys});
    });
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) return next();
    else res.redirect("/login");
}

function test(req, res, next){
    console.log("text");
    return next();
}

app.listen(3000, () => {
    console.log("server has started port on 3000");
});

