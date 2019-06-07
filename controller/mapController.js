// 주소 가공하기 (공백에서 끊어서 시군구 까지만 출력하게 함)
const mapControllerObj = {}
  
mapControllerObj.makeCustomAddress = function(latlngs) {
    let customAddressArr = [];
    //let splitedNativeArr = latlngs[0].addressName.split(" ");
    let splitedNativeArr = latlngs.addressName.split(" ");
    customAddressArr.push(splitedNativeArr[0]); //첫째 공백
    customAddressArr.push(splitedNativeArr[1]); //두번째 공백
    return customAddressArr.join(" ");
  };

  module.exports = mapControllerObj;