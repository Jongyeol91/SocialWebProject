var mapContainer = document.getElementById('map');

mapOption = {
    center: new daum.maps.LatLng(37.6512265449085, 127.076692983486),
    level: 6
};

var map = new daum.maps.Map(mapContainer, mapOption);

// ajax => 로컬주소 요청 => 가공 => html에 반영
function loadText() {
    const inputvalue = document.getElementById("searchInput").value;
    const myRequest = new Request("/getLocal");

    fetch(myRequest, {
            method: "POST",
            headers: new Headers({
                'Content-Type': "application/json"
            }),
            body: JSON.stringify({
                txt: inputvalue
            })
        })
        .then((res) => {
            return res.json();
        })
        .then((resultJson) => {
            console.log(resultJson);
            mappedLOCS = resultJson.documents.map((document) => {
                return {
                    name: document.place_name,
                    addressName: document.address_name,
                    id: document.id,
                    x: document.x,
                    y: document.y
                };
            });

            document.getElementById("article").innerHTML = "";
            mappedLOCS.forEach(element => {
                document.getElementById("article").innerHTML +=
                    `
          <input type="checkbox" id="${element.id}" class="latlng" 
          value="${element.x + "|" + element.y + "|" + element.name + "|" + element.addressName}"
          onchange="checkCheckbox.checkAddress(this, ${element.id});"> 
          ${element.name}: ${element.addressName} <p>
          `;
            });
        });
} 

// 로컬 체크박스 실시간 체크 - > 마커에 반영
const checkCheckbox = (function () {
    var checkedLocs = [];
    return {
        checkAddress: function (checkbox, locId) {
            if (checkbox.checked) {
                console.log("checkedLocs", checkedLocs);
                let latlngObj = getLatLng(checkbox);
                checkedLocs.push({
                    "lat": latlngObj.lat,
                    "lng": latlngObj.lng,
                    "locationName": latlngObj.locationName,
                    "addressName": latlngObj.addressName
                });
                panTo(latlngObj);
                controlMarker.setMarker(latlngObj, locId);
            } else {
                let latlngObj = getLatLng(checkbox);
                let index = checkedLocs.findIndex(e => e.lat === latlngObj.lat && e.lng == latlngObj.lng);
                if (index !== -1) checkedLocs.splice(index, 1);
                console.log("noncheckedLocs", checkedLocs);
                controlMarker.deleteMarker(locId);
            }
        },
        getCheckedLocs: function () {
            return checkedLocs;
        }
    };
})();

// 마커 생성 및 삭제
const controlMarker = (function () {
    const markers = [];
    return {
        setMarker: function (latlngObj, locId) {
            const markerPosition = new daum.maps.LatLng(latlngObj.lat, latlngObj.lng);
            const marker = new daum.maps.Marker({
                position: markerPosition
            });
            marker.setMap(map);
            markers.push({
                marker,
                locId
            });
        },
        deleteMarker: function (locId) {
            markers.forEach((element) => {
                if (element.locId === locId) {
                    element.marker.setMap(null);
                }
            });
        }
    };
})();

// 체크박스 주소 구하기
function getLatLng(checkbox) {
    stringLatLng = checkbox.value;
    console.log(stringLatLng);
    const latlngArr = stringLatLng.split("|");
    const latlngObj = {
        "lat": latlngArr[1],
        "lng": latlngArr[0],
        "locationName": latlngArr[2],
        "addressName": latlngArr[3]
    }
    console.log(latlngObj);
    return latlngObj;
}

// 지도 이동
function panTo(latlngObj) {
    var moveLatLon = new daum.maps.LatLng(latlngObj.lat, latlngObj.lng);
    map.panTo(moveLatLon);
}

//카테고리 
function getCheckedCategoriesFor() {
    const checkboxesNodeList = document.querySelectorAll(`input[name="category"]:checked`);
    return [].map.call(checkboxesNodeList, el => el.value); //nodeList 배열로 바꾸기
}

