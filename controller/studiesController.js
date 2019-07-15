const Comment = require('../models/comment');
const Study = require('../models/study');
const User = require('../models/user');
const moment = require('moment');
const mapController = require('../controller/mapController');

const studyControllerObj = {}

// 개별 스터디 보기
studyControllerObj.getEachStudy = (req, res) => {
    //Study.findById(req.params.id).populate("user").populate("comments").exec(function(err, foundStudy){
    Study.findById(req.params.id).populate({ 
        path: 'comments', model: Comment, populate: {
             path: 'author', model: User 
            }}).populate("joinUsers").exec((err, foundStudy) => {
        if (err || !foundStudy) {
            req.flash("error", "스터디를 찾을수 없습니다.");
            res.redirect("/");
        }
            res.render("study/eachStudy.ejs", { foundStudy: foundStudy, moment: moment });
    });
}

//스터디 만들기 창(get) 현재 로그인 없어도 스터디 만들기 체험 가능하게 해놓은 상태
studyControllerObj.getMakeStudyPage = (req, res) => {
    res.render("study/makeStudy.ejs"); 
    
    // if (req.user) {
    // } else {
    //     req.flash("error", "스터디를 만들기 위해 로그인을 먼저 하세요");
    //     res.redirect("/login");
    //}
}

// 스터디 생성 (post)
studyControllerObj.makeStudy =  (req, res) => {
    let studyName = req.body.data.studyName;
    let description = req.body.data.description;
    let recruNum =req.body.data.recruNum;
    let categories = req.body.data.categories;
    let latlngs = req.body.data.latlngs;

    let author = {
        id: req.user._id,
        username: req.user.username
    };

    studyAddress = mapController.makeCustomAddress(latlngs);
    let newStudy = {studyName, categories, recruNum, description, author, latlngs, studyAddress};
    
    Study.create(newStudy)
    .then((newlycreated) => {
        User.findOneAndUpdate({_id: req.user._id}, { $push:{ownStudy: newlycreated._id}}, {new: true})
        req.flash("success", "성공적으로 스터디를 개설했습니다.")
        res.status(200).send();
    })
    .catch((err) => {
        console.log(err)
    })
}

// eachStudy에서 오는 ajax  (개별 스터디의 좌표를 반환함)
studyControllerObj.getlatlng = (req, res) => {
    let id = req.body.id;
    Study.findById(id, (err, result) => { 
        res.send(result.latlngs);
     });
}

//index.ejs에서 오는 ajax (스터디의 모든 좌표를 배열로 다시 반환함) (사용하지 않는 중)
studyControllerObj.allGetlatlng = (req, res) => {
    Study.find({}, "latlngs", (err, results) => { 
        let arr = [];
        for (let i = 0; i < results.length; i++){
            for (let j = 0; j < results[i].latlngs.length; j++){
                arr.push(results[i].latlngs[j]);
            }
        }
        res.send(arr);
     });
}

// index.ejs에서 오는 ajax(스터디 전체 찾아서 메인화면 마커 표시하기 위해)
studyControllerObj.getAllStudies = (req, res) => {
    Study.find({}, (err, studys) => { 
        if(!studys || err){
            console.log(err)
        } else {
            res.send(studys);
        }
     });
}

// 스터디 가입 (user을 study에 추가) (현재 사용x)
studyControllerObj.joinStudy = (req, res) => {
    let studyId = req.params.id;
    // username은 세션으로 가져옴
    User.findOne({ username: req.user.username }, (err, foundUser) => {
        Study.findById(studyId, (err, foundStudy) => {
            foundStudy.joinUsers.push(foundUser._id);
            foundStudy.save();
        });
    });
    res.redirect("/study/" + studyId);
}

// 스터디 수정 페이지
studyControllerObj.getEditStudyPage = (req, res) => {
    //find()는 배열로 반환
    Study.findById(req.params.id, (err, foundStudy) => {
      res.render("study/editStudy.ejs", { foundStudy: foundStudy});
    });
}

//스터디 수정(post)
studyControllerObj.editStudy = (req, res) => {

    let studyName   = req.body.data.studyName;
    let description = req.body.data.description;
    let recruNum    = req.body.data.recruNum;
    let img         = req.body.data.imgurl;
    let categories  = req.body.data.categories;
    let latlngs     = req.body.data.latlngs;
    let studyAddress = mapController.makeCustomAddress(latlngs);
    let data = {studyName:studyName, description:description, recruNum:recruNum, img:img, latlngs:latlngs, categories:categories, studyAddress:studyAddress}

    Study.findOneAndUpdate({_id: req.params.id}, data, (err, updatedStudy) => {
        if(err || !updatedStudy){
            console.log(err);
        } else {
            //console.log(updatedStudy);
        }
        res.redirect("/study/" + req.params.id);
    });
}

// 스터디 삭제
studyControllerObj.deleteStudy = (req, res) => {
    Study.deleteOne({_id : req.params.id}, (err) => {
        if (err) {
            console.log(err);
            res.redirect("/study/" + req.params.id);
        } else {
            req.flash("success", "성공적으로 삭제했습니다.");
            res.redirect("/");
        }
    });
}



module.exports = studyControllerObj;