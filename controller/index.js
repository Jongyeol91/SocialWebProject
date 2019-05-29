const controllerObj = {};;

let b= "bb"

controllerObj.checkCategories = function (){
    checkboxValueArr = getCheckedCategoriesFor();
    checkboxValueArr.forEach((e)=>{
      if( e=== "사기업"){
        document.getElementById("customCheck1").checked = true
      } else if (e === "공기업") {
        document.getElementById("customCheck2").checked = true
      } else if (e === "인적성") {
        document.getElementById("customCheck3").checked = true
      } else if (e === "면접") {
        document.getElementById("customCheck4").prop("checked", checked);
      } else if (e === "자소서") {
        document.getElementById("customCheck5").prop("checked", checked);
      }
    });
};

controllerObj.makeCustomAddress = function(latlngs) {
  console.log("this is controller latlngs", latlngs)
  let customAddressArr = [];
  let splitedNativeArr = latlngs[0].addressName.split(" ");
  customAddressArr.push(splitedNativeArr[0]);
  customAddressArr.push(splitedNativeArr[1]);
  console.log("this is controller customAddressArr", customAddressArr)
  return customAddressArr.join(" ");
};


module.exports = controllerObj
