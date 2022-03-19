var test = 'abc123';

for (let i = 0; i < test.length; i++) {
  arr = test.split('');
}
result = arr.filter((cv) => {
  return 97 <= cv.charCodeAt(0) && cv.charCodeAt(0) <= 122;
  //return cv!=="1" && cv!== "2" && cv!== "3" && cv!== "4" && cv!== "5" && cv!== "6" && cv!== "7"&& cv!== "8" && cv!== "9" && cv!== "0";
});
console.log(result.join(''));

var my_string = "John Doe's iPhone6";
var spaceCount = my_string.split(' ').length - 1;
console.log(spaceCount);
