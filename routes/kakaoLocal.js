const express = require('express');
const router = express.Router();
const request = require('request');

// 카카오 로컬 검색 api (지도X)
router.post('/getLocal', (req, res) => {
  const searchTXT = req.body.txt;
  console.log('searchTXT', searchTXT);
  var headers = {
    Authorization: 'KakaoAK 04f0c228e5b8e4fced64d52e5219ba63',
  };
  var options = {
    url:
      'https://dapi.kakao.com/v2/local/search/keyword.json?y=37.514322572335935&x=127.06283102249932&radius=20000&query=' +
      encodeURIComponent(searchTXT),
    headers: headers,
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  }
  request(options, callback);
});

module.exports = router;
