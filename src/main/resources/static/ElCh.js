//==================================================
// custom Func

//// 즐겨찾기
let bookMarkList = [];

//// [TODO]bookMarkList 를 DB에서 받아온걸로 업데이트

// 충전소 정보 업데이트
function UpdateInfo(stationID){
    let foundIndexes = [];
    stations.forEach(function(item, index) {
        if (item.stationID == stationID) {
            foundIndexes.push(item);
        }
    });
    return foundIndexes;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////충전소별 사용현황
//전역변수로 선언 -> 여러 함수에서 사용
var slow_using_num ;
var slow_all_num ;
var fast_using_num ;
var fast_all_num ;

function resetCounters() {
    slow_using_num = 0;
    slow_all_num = 0;
    fast_using_num = 0;
    fast_all_num = 0;
}
function slowFast(data) {
    data.forEach(function(item) {
        if (item.chargerType == 1) {
            slow_all_num++;
            if (item.chargerStatus == 3) {
                slow_using_num++;
            }
        } else if (item.chargerType == 2) {
            fast_all_num++;
            if (item.chargerStatus == 3) {
                fast_using_num++;
            }
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////충전소 상태별 색상 변경
function changeMarkerColor(stationID) {
    let data = UpdateInfo(stationID);
    resetCounters();
    slowFast(data);

    var imgSrc;
    if (slow_using_num == slow_all_num && fast_using_num == fast_all_num) {
        imgSrc = "../img/marker1.png";
    } else if (0 < slow_using_num && slow_using_num < slow_all_num || 0 < fast_using_num && fast_using_num < fast_all_num) {
        imgSrc = "../img/marker2.png";
    } else {
        imgSrc = "../img/marker3.png";
    }
    return imgSrc;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////오른쪽 팝업에 충전소별 사용현황 정보 전달
// 충전소 정보 인터페이스 스윕
function InfoShowOn() {

    document.getElementById("info").style.display = "block";
    // document.getElementById("info").style.border = "0.5vw solid blueviolet";
    // document.getElementById("map").style.width = "80vw";
}
function InfoShowOff(){
    document.getElementById("info").style.display = "none";
    // document.getElementById("info").style.border = "";
    // document.getElementById("map").style.width = "100vw";
}
// 충전소 정보 인터페이스 닫기 이벤트
document.getElementById("info_close").addEventListener("click", function(){
    InfoShowOff();

},false)

//==================================================
// map Func
/////////////////////////////////////////////////////지도생성
var mapContainer = document.getElementById('map'), // 지도의 중심좌표
    mapOption = {
        center: new kakao.maps.LatLng(33.451475, 126.570528), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다



/////////////////////////////////////////////////////현재위치
navigator.geolocation.getCurrentPosition(function(position) {

    var lat = position.coords.latitude, // 위도
        lon = position.coords.longitude; // 경도

    var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
        message = ''; // 인포윈도우에 표시될 내용입니다

    // 마커와 인포윈도우를 표시합니다
    infoInPointMarker(locPosition, message);
    fetchNearbyStations(lat, lon);
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);

});
var debounceTimer;
function debounce(func, delay) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

kakao.maps.event.addListener(map, 'idle', debounce(function() {
    // 지도의 현재 중심 좌표를 가져옵니다
    var center = map.getCenter();
    var message = '지도 중심 좌표는 위도 ' + center.getLat() + ' 경도 ' + center.getLng() + ' 입니다';
    fetchNearbyStations(center.getLat(), center.getLng());
    document.getElementById('centerCoords').innerText = message;
}, 1000));

var stations = []; //정보 배열

window.onload = function () {
    //fetchStations();
    if (localStorage.getItem('loggedIn') === 'true') {
        replaceLoginWithLogout();
    }
}



function fetchStations() {
    fetch('/stationList')
        .then(response => response.json())
        .then(data => {
            stations = data.map(item => ({
                stationAddress: item.stationAddress,
                chargerType: item.chargerType,
                chargerID: item.chargerID,
                chargerName: item.chargerName,
                chargerStatus: item.chargerStatus,
                chargerTerminal: item.chargerTerminal,
                stationID: item.stationID,
                stationName: item.stationName,
                latlng: new kakao.maps.LatLng(item.stationLatitude, item.stationLongitude),
                status_UpdateTime: item.status_UpdateTime
            }));
            // stations 배열을 사용하는 로직
            //console.log(stations);

            // stations 배열을 사용하는 로직
            for(let i=0; i < stations.length; i++){
                var data = stations[i];
                displayMarker(data);
            }

        })
        .catch(error => console.error('Error:', error));
}
//
//이주형
function removeNearByInfo() {
    console.log("제거 실행")
    nearByMarkers.forEach(marker => marker.setMap(null));
    nearByOverlays.forEach(overlay => overlay.setMap(null));
    nearByMarkers = [];
    nearByOverlays = [];
}

//이주형
    var nearByMarkers = [];
    var nearByOverlays = [];
    var nearByStations = [];
    var newNearByStations = [];

function fetchNearbyStations(lat, lon) {
    console.log("니어바이 실행")
    newNearByStations = [];
    //removeNearByInfo();//이주형
    fetch(`/api/chargers/nearbyList?latitude=${lat}&longitude=${lon}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            stations = data.map(item => {
                let chargerType;
                if (item.output > 50) {
                    chargerType = 2;
                } else {
                    chargerType = 1;
                }
                return {
                    stationAddress: item.addr,
                    chargerType: chargerType,
                    chargerID: item.chgerId,
                    stationID: item.statId,
                    stationName: item.statNm,
                    latlng: new kakao.maps.LatLng(item.lat, item.lng),
                    chargerStatus: item.stat,
                };
            });
            //이주형
            //stations배열의 stationID와 nearByStations의 stationID를 비교하여 중복되지않은 것만 newNearByStations에 저장한후 nearByStations에 newNearByStations을 추가해줘
                        // 중복되지 않은 station만 newNearByStations 배열에 저장
                        const newNearByStations = stations.filter(station =>
                            !nearByStations.some(nearby => nearby.stationID === station.stationID)
                        );

                        // newNearByStations를 nearByStations에 추가
                        nearByStations.push(...newNearByStations);

                        // newNearByStations 배열을 사용하는 로직
                        newNearByStations.forEach(data => {
                            displayMarker(data);
                        });
        })
        .catch(error => console.error('Error:', error));
}
// 호출하여 데이터 로드 및 표시
//loadAndDisplayStations();

var displayMarKerOverlays = [];
// 지도에 마커를 표시하는 함수입니다
function displayMarker(data) {
    var imageSrc=changeMarkerColor(data.stationID);
    //마커 이미지 크기 표시
    var imageSize = new kakao.maps.Size(35, 35);
    // 마커 이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    var marker = new kakao.maps.Marker({
        map: map,
        position: data.latlng,
        image : markerImage // 마커 이미지
    });
    var overlay = new kakao.maps.CustomOverlay({
        yAnchor: 1.2,
        position: marker.getPosition()
    });
//////////////////////////////////////////////////////////////////////////////////////////////////list에 추가
    document.getElementById("bookMark").addEventListener("click",function(){
        InfoShowOn();
    });
    function addList(data){
        var infoList = document.getElementById("info_ul");
        var li = document.createElement("li");
        li.id = data.stationID+"li";
        var str = " ";
        str += '<div><a>' + data.stationName + '</a></div>';
        li.innerHTML = str;

        infoList.appendChild(li);
    }
    function removeList(stationID){
        var removeChildList =document.getElementById(stationID);
        console.log(removeChildList);
        document.getElementById("info_ul").removeChild(removeChildList);
    }
    //////////////////////////////////////////////////////////////////////인포 윈도우에 정보 동적 생성


    var container = document.createElement('div');
    container.id = data.stationID;
    container.style.cssText = 'background: white; border: 1px solid black ;';
    resetCounters();
    slowFast(UpdateInfo(data.stationID));
    var content = document.createElement('div');
    let str = " ";
    str +=        '<div id = "charger_name">'
    str +=            '<div id = "name">'
    str +=                '<div><a id = "name_text1">'+data.stationName+'</a></div>'
    str +=                '<div><a id = "name_text2">'+data.stationAddress +'</a></div>'
    str +=            '</div>'
    str +=        '</div>'
    str +=        '<div id = "charger_name_2">'
    str +=            '<div id = "slow">'
    str +=                 '<div><img src="../img/slow.png" width="20%"><a>완속 충전기</a></div>'
    str +=                '<a><span id = "slow_using">'+slow_using_num+'</span>/<span id = "slow_all">'+slow_all_num+'</span> 사용중 </a>'
    str +=             '</div>'
    str +=            '<div id = "fast">'
    str +=                '<div><img src="../img/fast.png" width="20%"><a>급속 충전기</a></div>'
    str +=                '<a><span id = "fast_using">'+fast_using_num+'</span>/<span id = "fast_all">'+fast_all_num+'</span> 사용중 </a>'
    str +=            '</div>'
    str +=        '</div>'
    content.innerHTML =  str;
    content.id = data.stationID;
    container.append(content);


    var bookMark = document.createElement('button');
    bookMark.innerHTML = '☆';
    bookMark.id = data.stationID;
    container.appendChild(bookMark);
    overlay.setContent(container);
    bookMark.onclick = function (event) {
        if ( bookMarkList.includes(event.target.id) ){
            bookMark.innerHTML = '☆';
            bookMarkList = bookMarkList.filter(id => id !== event.target.id);
            removeList(data.stationID+"li");
        }else {
            bookMark.innerHTML = '★';
            bookMarkList.push(event.target.id);
            addList(data);
        }
    };


    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '닫기';
    closeBtn.style.cssText='border-radius : 5px; background-color : RGB(158,158,158) ; border: 1px solid RGB(143,143,143) ; color : white';
    closeBtn.id = data.stationID;
    container.appendChild(closeBtn);
    overlay.setContent(container);
    closeBtn.onclick = function () {
        overlay.setMap(null);
    };

    const stationID = document.createElement('div');
    stationID.id = data.stationID;
    stationID.style.cssText = 'width:0px; height:0px; overflow:hidden;';
    container.append(stationID);

    kakao.maps.event.addListener(marker, 'click', function() {
        setNullOverlays();
        setNullDisplatMarkerOverlays();
        overlay.setMap(map);
    });

    //이주형
    //nearByMarkers.push(marker);
    //nearByOverlays.push(overlay);

    displayMarKerOverlays.push(overlay);
}
//
//==================================================


// 인포윈도우를 표시하는 클로저를 만드는 함수입니다
function makeOverListener(map, marker, overlay) {
    return function() {
        overlay.setMap(map);
    };
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다
function makeOutListener(overlay) {
    return function() {
        overlay.close();
    };
}

function closeOverlay() {
    overlay.setMap(null);
}



//거래 계산 함수
//현위치, 마커들 거리 위치 차이 계산
///////////////////////////////////////////////// click2 거리 우선 기능
var markers = []; // 모든 마커를 저장할 배열입니다.
var overlays = []; // 모든 오버레이를 저장할 배열입니다.
var currentMarkers = [];

function removeCurrentMarker() {
    currentMarkers.forEach(marker => marker.setMap(null));
    currentMarkers = [];
}

function removeMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}
function removeOverlays() {
    overlays.forEach(overlay => overlay.setMap(null));
    overlays = [];
}

function setNullDisplatMarkerOverlays() {
    displayMarKerOverlays.forEach(overlay => overlay.setMap(null));
}
function setNullOverlays() {
    overlays.forEach(overlay => overlay.setMap(null));
}

click1.addEventListener("click", function(){
    setNullDisplatMarkerOverlays();
    removeMarkers();
    removeOverlays();
    removeCurrentMarker();
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도

        var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            message = ''; // 인포윈도우에 표시될 내용입니다

        // 마커와 인포윈도우를 표시합니다
        infoInPointMarker(locPosition, message);

        // 지도 중심좌표를 접속위치로 변경합니다
        map.setCenter(locPosition);
    });
}, false);
//거리우선 기능
click2.addEventListener("click", function(){
    setNullDisplatMarkerOverlays();
    setNullOverlays();
    removeMarkers();
    removeOverlays();
    const aa = calLengthByDistance();
    console.log(+aa);
}, false);

click3.addEventListener("click", function(){
    setNullDisplatMarkerOverlays();
    setNullOverlays();
    removeMarkers();
    removeOverlays();
    calLengthByAvailability();
}, false);

click4.addEventListener("click", function(){
    setNullDisplatMarkerOverlays();
    setNullOverlays();
    removeMarkers();
    removeOverlays();
    calLengthByFastCharger();
}, false);
///////////////////////////////////////////////////////////////////////////////////우선순위 표시 마커
function infoDisplayMarker(data, index) {
    var imageSrc ;
    switch (index){
        case 0:
            imageSrc = "../img/free-icon-number-1.png";
            break;
        case 1:
            imageSrc = "../img/free-icon-number-2.png";
            break;
        case 2:
            imageSrc = "../img/free-icon-number-3.png";
            break;
        case 3:
            imageSrc = "../img/free-icon-number-4.png";
            break;
        case 4:
            imageSrc = "../img/free-icon-number-5.png";
            break;

    }
    //마커 이미지 크기 표시
    var imageSize = new kakao.maps.Size(35, 40);
    // 마커 이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    var marker = new kakao.maps.Marker({
        map: map,
        position: data.latlng,
        image : markerImage // 마커 이미지
    });
    var overlay = new kakao.maps.CustomOverlay({
        yAnchor: 1.2,
        position: marker.getPosition()
    });
    var container = document.createElement('div');
    container.id = data.stationID;
    container.style.cssText = 'background: white; border: 1px solid black ;';
    resetCounters();
    slowFast(UpdateInfo(data.stationID));
    var content = document.createElement('div');
    let str = " ";
    str +=        '<div id = "charger_name">'
    str +=            '<div id = "name">'
    str +=                '<div><a id = "name_text1">'+data.stationName+'</a></div>'
    str +=                '<div><a id = "name_text2">'+data.stationAddress +'</a></div>'
    str +=            '</div>'
    str +=        '</div>'
    str +=        '<div id = "charger_name_2">'
    str +=            '<div id = "slow">'
    str +=                 '<div><img src="../img/slow.png" width="20%"><a>완속 충전기</a></div>'
    str +=                '<a><span id = "slow_using">'+slow_using_num+'</span>/<span id = "slow_all">'+slow_all_num+'</span> 사용중 </a>'
    str +=             '</div>'
    str +=            '<div id = "fast">'
    str +=                '<div><img src="../img/fast.png" width="20%"><a>급속 충전기</a></div>'
    str +=                '<a><span id = "fast_using">'+fast_using_num+'</span>/<span id = "fast_all">'+fast_all_num+'</span> 사용중 </a>'
    str +=            '</div>'
    str +=        '</div>'
    content.innerHTML =  str;
    content.id = data.stationID;
    container.append(content);

    var bookMark = document.createElement('button');
    bookMark.innerHTML = '☆';
    bookMark.id = data.stationID;
    container.appendChild(bookMark);
    overlay.setContent(container);
    bookMark.onclick = function (event) {
        if ( bookMarkList.includes(event.target.id) ){
            bookMark.innerHTML = '☆';
            bookMarkList.pop(event.target.id);
            removeList(data.stationID+"li");
        }else {
            bookMark.innerHTML = '★';
            bookMarkList.push(event.target.id);
            addList(data);
        }
    };

    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '닫기';
    closeBtn.id = data.stationID;
    container.appendChild(closeBtn);
    overlay.setContent(container);
    closeBtn.onclick = function () {
        overlay.setMap(null);
    };

    const stationID = document.createElement('div');
    stationID.id = data.stationID;
    stationID.style.cssText = 'width:0px; height:0px; overflow:hidden;';
    container.append(stationID);

    kakao.maps.event.addListener(marker, 'click', function() {
        setNullDisplatMarkerOverlays();
        setNullOverlays();
        overlay.setMap(map);
    });


    marker.setMap(map);

    markers.push(marker);
    overlays.push(overlay);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 빈칸 우선

function calLengthByDistance() {
    removeDuplicateStations();
    let closestStations;
    navigator.geolocation.getCurrentPosition(position => {
        const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        closestStations = findClosestStations(currentPosition, uniqueStations);

        console.log("Closest 5 stations:", closestStations);

        closestStations.forEach((station,index) => {
            var p1 = new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng);
            var p2 = station.latlng;
            var polygon = new kakao.maps.Polygon({
                path: [p1, p2]
            });

            var path = polygon.getPath();
            path.push(p1);
            polygon.setPath(path);

            var distance = Math.round(polygon.getLength());
            var message = '<div class="dotOverlay distanceInfo">총거리 <span class="number">' + distance + '</span>m</div>';
            infoDisplayMarker(station,index);
            console.log("distance to station:", station, distance);
            console.log("index" + index);
        });
    });
    return closestStations;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 빈칸 우선
function calLengthByAvailability() {
    removeDuplicateStationsByAvailability();
    navigator.geolocation.getCurrentPosition(position => {
        const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        const closestStations = findClosestStationsByAvailability(currentPosition, uniqueStationsByAvailability, 5);
        console.log("Closest 6 stations by 빈칸우선:", closestStations);

        closestStations.forEach((station,index) => {
            var p1 = new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng);
            var p2 = station.latlng;
            var polygon = new kakao.maps.Polygon({
                path: [p1, p2]
            });

            var path = polygon.getPath();
            path.push(p1);
            polygon.setPath(path);

            var distance = Math.round(polygon.getLength());
            var message = '<div class="dotOverlay distanceInfo">총거리 <span class="number">' + distance + '</span>m, 빈 충전기: ' + station.availableChargers + '</div>';
            infoDisplayMarker(station,index);
            console.log(`Distance to station ${station.name} (Address: ${station.stationAddress}): ${station.distance} meters, Available chargers: ${station.availableChargers}`);
        });
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 고속우선
function calLengthByFastCharger() {
    removeDuplicateStationsByFastCharger();
    navigator.geolocation.getCurrentPosition(position => {
        const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        const closestStations = findClosestStationsByFastCharger(currentPosition, uniqueStationsByFastCharger, 5);
        console.log("Closest 5 stations with fast chargers:", closestStations);
        //closestStations을 이용
        closestStations.forEach((station,index) => {
            var p1 = new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng);
            var p2 = station.latlng;
            var polygon = new kakao.maps.Polygon({
                path: [p1, p2]
            });

            var path = polygon.getPath();
            path.push(p1);
            polygon.setPath(path);

            var distance = Math.round(polygon.getLength());
            var message = '<div class="dotOverlay distanceInfo">총거리 <span class="number">' + distance + '</span>m, 빈 충전기: ' + station.availableChargers + '</div>';
            infoDisplayMarker(station,index);
            console.log(`Distance to station ${station.name} (Address: ${station.stationAddress}): ${station.distance} meters, Available chargers: ${station.availableChargers}`);
        });
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function infoInPointMarker(position, message) {
    var imageSrc = "../img/car.png"; //현재위치 마커 변경해주세요
    //마커 이미지 크기 표시
    var imageSize = new kakao.maps.Size(45, 45);
    // 마커 이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    var marker = new kakao.maps.Marker({
        position: position,
        image : markerImage
    });

    var overlay = new kakao.maps.CustomOverlay({
        content: message,
        position: position,
        xAnchor: 0.5,
        yAnchor: 1.2
    });

    kakao.maps.event.addListener(marker, 'click', function() {
        overlay.setMap(map);
    });

    marker.setMap(map);
    overlay.setMap(map);

    currentMarkers.push(marker);
    overlays.push(overlay);
}

// 거리 우선 중복 제거
function removeDuplicateStations() {
    const uniqueIds = new Set();
    uniqueStations = [];

    stations.forEach(station => {
        if (!uniqueIds.has(station.stationID)) {
            uniqueIds.add(station.stationID);
            uniqueStations.push(station);
        }
    });
}
//1번이 충전가능
// 빈칸 우선 중복 제거
function removeDuplicateStationsByAvailability() {
    const stationMap = new Map();

    stations.forEach(station => {
        if (!stationMap.has(station.stationAddress)) {
            stationMap.set(station.stationAddress, {
                ...station,
                availableChargers: station.chargerStatus === 2 ? 1 : 0
            });
        } else {
            const existingStation = stationMap.get(station.stationAddress);
            existingStation.availableChargers += station.chargerStatus === 2 ? 1 : 0;
        }
    });

    uniqueStationsByAvailability = Array.from(stationMap.values());
}

// 고속 충전기 우선 중복 제거
function removeDuplicateStationsByFastCharger() {
    const stationMap = new Map();

    stations.forEach(station => {
        if (station.chargerType === 2) {
            if (!stationMap.has(station.stationAddress)) {
                stationMap.set(station.stationAddress, {
                    ...station,
                    availableChargers: station.chargerStatus === 2 ? 1 : 0
                });
            } else {
                const existingStation = stationMap.get(station.stationAddress);
                existingStation.availableChargers += station.chargerStatus === 2 ? 1 : 0;
            }
        }
    });

    uniqueStationsByFastCharger = Array.from(stationMap.values());
}

function calculateDistance(lat1, lng1, lat2, lng2) {
    function toRad(value) {
        return value * Math.PI / 180;
    }

    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Distance in meters
    return distance;
}

function findClosestStations(currentPosition, uniqueStations) {
    uniqueStations.forEach(station => {
        const distance = calculateDistance(
            currentPosition.lat,
            currentPosition.lng,
            station.latlng.getLat(),
            station.latlng.getLng()
        );
        station.distance = distance;
    });

    uniqueStations.sort((a, b) => a.distance - b.distance);

    return uniqueStations.slice(0, 5);
}

function findClosestStationsByAvailability(currentPosition, uniqueStations, numberOfStations) {
    uniqueStations.forEach(station => {
        const distance = calculateDistance(
            currentPosition.lat,
            currentPosition.lng,
            station.latlng.getLat(),
            station.latlng.getLng()
        );
        station.distance = distance;
    });

    // 거리에 따라 정렬
    uniqueStations.sort((a, b) => a.distance - b.distance);
    const closestStations = uniqueStations.slice(0, 20);

    // availableChargers가 많은 순서대로 정렬
    closestStations.sort((a, b) => {
        if (a.availableChargers === b.availableChargers) {
            return a.distance - b.distance; // 가용 충전기가 같다면 거리순으로 오름차순 정렬
        }
        return b.availableChargers - a.availableChargers; // 가용 충전기가 많은 순서대로 내림차순 정렬
    });

    return closestStations.slice(0, numberOfStations); // numberOfStations의 수만큼 반환
}


function findClosestStationsByFastCharger(currentPosition, uniqueStationsByFastCharger, numberOfStations) {
    uniqueStationsByFastCharger.forEach(station => {
        const distance = calculateDistance(
            currentPosition.lat,
            currentPosition.lng,
            station.latlng.getLat(),
            station.latlng.getLng()
        );
        station.distance = distance;
    });

    uniqueStationsByFastCharger.sort((a, b) => a.distance - b.distance);

    return uniqueStationsByFastCharger.slice(0, numberOfStations);
}

// 데이터베이스에서 값을 가져와서 마커를 찍는 함수
function refreshMarkers() {
    console.log("refreshMarkers function started"); // 함수 시작 로그

    fetch('/updateData')
        .then(response => response.json())
        .then(data => {
            console.log("Fetched data: ", data); // 가져온 데이터 로그
            for (let i = 0; i < data.length; i++) {
                let position = new kakao.maps.LatLng(data[i].lat, data[i].lng);
                let marker = new kakao.maps.Marker({
                    position: position
                });
                marker.setMap(map);
                markers.push(marker);
            }
            console.log("Markers created: ", markers); // 생성된 마커 로그
        })
        .catch(error => {
            console.error("Error in refreshMarkers: ", error); // 에러 로그
        });
}

document.getElementById("update_time").addEventListener("click", function (){
    setNullDisplatMarkerOverlays();
    removeMarkers();
    removeOverlays();
    refreshMarkers();
})

////////////////////////////////////////////////로그인 to 로그아웃




function handleLogout() {
    alert("You have been logged out.");
    document.getElementById('loginForm').innerHTML = '<a href="/login" class="button">로그인</a>';

    // Additional logout logic here (e.g., clearing tokens, session data)
}

// Function to replace login link with logout button
function replaceLoginWithLogout() {
    localStorage.removeItem('loggedIn'); // Remove the login state
    document.getElementById('loginForm').innerHTML = '<button id="logoutButton" class="button">로그아웃</button>';
    document.getElementById('logoutButton').addEventListener('click', handleLogout);
}



