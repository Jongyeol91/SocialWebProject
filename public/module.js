let mapContainer = document.getElementById('map');

mapOption = {
    center: new daum.maps.LatLng(37.6512265449085, 127.076692983486),
    level: 6
};

let map = new daum.maps.Map(mapContainer, mapOption);

function makeMarkerImage (){
    let imageSrc = '/customMarker.png',     
        imageSize = new daum.maps.Size(34, 34), 
        imageOption = {offset: new daum.maps.Point(20, 42)}, 
        markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption);
    return markerImage
}

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
        //console.log(resultJson);
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
        document.getElementById("article").innerHTML +=`

        <div class="custom-control custom-checkbox" style="width:350px">
            <input type="checkbox" id="${element.id}" class="custom-control-input" name="searchLoc"
            value="${element.x + "|" + element.y + "|" + element.name + "|" + element.addressName}"
            onclick="checkCheckbox.ischecked(this, ${element.id});"/> 
            
            <label class="custom-control-label" for="${element.id}"> ${element.name}: ${element.addressName}</label>
        </div>
            `;
        });
    });
} 

// 로컬 체크박스 실시간 체크 - > 마커에 반영
const checkCheckbox = (function () {
    let checkedLocs = [];
    
    return {
        ischecked: function (checkbox, locId) {
            markerImage = makeMarkerImage();
            let maxSelect = 1 // 장소 최대 선택 갯수
            
            if (checkbox.checked) {
                let latlngObj = getLatLng(checkbox);
                
                document.querySelectorAll("input[name=searchLoc]:checked").length > maxSelect 
                let checkboxies= document.querySelectorAll("input[name=searchLoc]")
                
                checkboxies.forEach (checkbox => {
                    if (!checkbox.checked)
                        checkbox.disabled = true
                })

                checkedLocs.push({
                    "lat": latlngObj.lat,
                    "lng": latlngObj.lng,
                    "locationName": latlngObj.locationName,
                    "addressName": latlngObj.addressName
                });

                panTo(latlngObj);
                controlMarker.setMarker(latlngObj, locId, markerImage);
            } else {
                let checkboxies= document.querySelectorAll("input[name=searchLoc]")
                checkboxies.forEach (checkbox=> {
                    if(!checkbox.checked)
                        checkbox.disabled=false
                })
                let latlngObj = getLatLng(checkbox);
                //console.log("unchecked", latlngObj)
                let index = checkedLocs.findIndex(e => e.lat === latlngObj.lat && e.lng == latlngObj.lng);
                if (index !== -1) checkedLocs.splice(index, 1);
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
        setMarker: function (latlngObj, locId, markerImage) {
            // 마커생성
            const markerPosition = new daum.maps.LatLng(latlngObj.lat, latlngObj.lng);
            const marker = new daum.maps.Marker({
                position: markerPosition,
                image: markerImage
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
    //console.log(stringLatLng);
    const latlngArr = stringLatLng.split("|");
    const latlngObj = {
        "lat": latlngArr[1],
        "lng": latlngArr[0],
        "locationName": latlngArr[2],
        "addressName": latlngArr[3]
    }
    //console.log(latlngObj);
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

