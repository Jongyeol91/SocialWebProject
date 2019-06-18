const express = require('express');
const router = express.Router({ mergeParams: true });
const middleware = require('../middleware'); // index.js의 파일명은 따로 임포트 해줄 필요가 없음
const studiesController = require('../controller/studiesController'); 
 

// 개별 스터디 보기
router.get("/:id", studiesController.getEachStudy);

//스터디 만들기 창
router.get("/", studiesController.getMakeStudyPage);

// 스터디 생성
router.post("/", middleware.isLoggedIn, studiesController.makeStudy);

// eachStudy에서 오는 ajax (개별 스터디가 가지고 있는 좌표를 반환함)
router.post("/getlatlng", studiesController.getlatlng);

// index.ejs에서 오는 ajax(스터디 전체 찾아서 메인화면 마커 표시하기 위해)
router.post("/getAllStudies", studiesController.getAllStudies);

router.get("/:id/user/new", middleware.isLoggedIn, (req, res) => {
    res.redirect("/");
});

// 스터디 가입 (user을 study에 추가) (현재 사용x)
router.post("/:id/user/new", middleware.isLoggedIn, studiesController.joinStudy);

// 스터디 수정 페이지
router.get("/:id/edit", middleware.isOwnerShip, studiesController.getEditStudyPage);

//스터디 수정
router.post("/:id/edit", middleware.isOwnerShip, studiesController.editStudy);

// 스터디 삭제
router.delete("/:id/delete", middleware.isOwnerShip, studiesController.deleteStudy);


module.exports = router;