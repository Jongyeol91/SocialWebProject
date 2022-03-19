// id 길이 검사
function checkIdLength(userInputId) {
  document.getElementById('checkIdArea').innerHTML = '';
  isCheckedId = false;
  document.getElementById(
    'checkIdArea'
  ).innerHTML = `<span style="color: orange"> 아이디 중복검사를 하세요 </sapn>`;
  if (userInputId.length < 1) {
    document.getElementById(
      'checkIdArea'
    ).innerHTML = `<span style="color: orange"> 아이디를 입력하세요 </sapn>`;
    return false;
  } else if (userInputId.length >= 15) {
    document.getElementById(
      'checkIdArea'
    ).innerHTML = `<span style="color: red">15자리 이상 입력할 수 업습니다!</span>`;
    return false;
  }
}

// id중복검사
function checkId() {
  var userID = document.getElementById('userID').value;
  if (userID == '') {
    document.getElementById(
      'checkIdArea'
    ).innerHTML = `<span style="color: orange"> 아이디를 입력하세요 </sapn>`;
  } else {
    const checkIdRequest = new Request('/checkid');
    fetch(checkIdRequest, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        userID: userID,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resultJson) => {
        if (resultJson.possibleId) {
          isCheckedId = true;
          document.getElementById(
            'checkIdArea'
          ).innerHTML = `<sapn style="color: green">사용할 수 있는 아이디 입니다.</span>`;
        } else {
          isCheckedId = false;
          document.getElementById(
            'checkIdArea'
          ).innerHTML = `<sapn style="color: red">사용할 수 없는 아이디 입니다.</span>`;
        }
      });
  }
}
