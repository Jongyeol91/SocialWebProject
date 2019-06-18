  // 패스워드 길이검사
  function checkFirstPassword(password){
    if (password.length < 8) {
       document.getElementById("equalityMSG").innerHTML =''
       document.getElementById("password1Label").innerHTML = `<span style="color: orange"> 비밀번호를 8자리 이상 입력하세요 </sapn>`
   } else if (password.length >= 8) {
       document.getElementById("password1Label").innerHTML = `<span style="color: green"></span>`
       return checkValadity()
   } 
}

// 패스워드 길이검사 2
function checkSecondPassword(password){
   if (password.length < 8) {
       document.getElementById("equalityMSG").innerHTML =''
       document.getElementById("password2Label").innerHTML = `<span style="color: orange"> 비밀번호를 8자리 이상 입력하세요 </sapn>`
   } else if (password.length >= 8) {
       document.getElementById("password2Label").innerHTML = `<span style="color: green"> </span>`
       return checkValadity()
   } 
}

// 8자리 이상으로 키 입력이 들어오면 패스워드 동일한지 검사
function checkValadity(){
   var currentPwd1 = document.getElementById("password1").value
   var currentPwd2 = document.getElementById("password2").value
   if((currentPwd1.length >= 8) && (currentPwd2.length >= 8)){
       if ( (currentPwd1 === currentPwd2) && !(currentPwd1.length === 0) && !(currentPwd2.length === 0) ) {
           document.getElementById("equalityMSG").innerHTML = `<span style="color: green"> 비밀번호가 같습니다. </sapn>`
           return true
       } else if (!(currentPwd1 === currentPwd2)) {
           document.getElementById("equalityMSG").innerHTML = `<span style="color: red"> 비밀번호가 다릅니다. </sapn>`
        }
   }
}




