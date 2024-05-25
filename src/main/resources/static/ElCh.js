//==================================================
// custom Func

// 임시
document.getElementById("click1").addEventListener("click", function(){
    InfoShowOn();
},false)

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
//충전소 상태별 색상 변경
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

function slowFast(data) {
    data.forEach(function(item) {
        if (item.chargerType == 1) {
            slow_all_num++;
            if (item.chargerStatus != 1) {
                slow_using_num++;
            }
        } else if (item.chargerType == 2) {
            fast_all_num++;
            if (item.chargerStatus != 1) {
                fast_using_num++;
            }
        }
    });
}
// 충전소 정보 인터페이스 스윕
function InfoShowOn(stationID) {
    let data = UpdateInfo(stationID);
    document.getElementById("name_text1").innerHTML = data[0].stationName;
    document.getElementById("name_text2").innerHTML = data[0].stationAddress;
    resetCounters();
    slowFast(data);
    document.getElementById("slow_using").innerHTML = slow_using_num;
    document.getElementById("slow_all").innerHTML = slow_all_num;
    document.getElementById("fast_using").innerHTML = fast_using_num;
    document.getElementById("fast_all").innerHTML = fast_all_num;
    document.getElementById("info").style.width = "38vw";
    // document.getElementById("info").style.border = "0.5vw solid blueviolet";
    document.getElementById("map").style.width = "62vw";
}
function InfoShowOff(){
    document.getElementById("info").style.width = "0vw";
    // document.getElementById("info").style.border = "";
    document.getElementById("map").style.width = "100vw";
}
// 충전소 정보 인터페이스 닫기 이벤트
document.getElementById("close").addEventListener("click", function(){
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
        message = '<div style="padding:5px;">현재 위치</div>'; // 인포윈도우에 표시될 내용입니다

    // 마커와 인포윈도우를 표시합니다
    pointMarker(locPosition, message);

    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);

});

// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function pointMarker(locPosition, message) {

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: locPosition
    });

    var iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

    // 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({
        content : iwContent,
        removable : iwRemoveable,
        maxWidth: 140,
        backgroundColor: "#eee",
        borderColor: "#2db400",
        borderWidth: 5,
        anchorSize: new kakao.maps.Size(30, 30),
        anchorSkew: true,
        anchorColor: "#eee",
        pixelOffset: new kakao.maps.Point(20, -20)
    });

    // 인포윈도우를 마커위에 표시합니다
    infowindow.open(map, marker);

}

var stations = []; //정보 배열

window.onload = function () {
    fetchStations();
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


// 지도에 마커를 표시하는 함수입니다
function displayMarker(data) {
    var imageSrc=changeMarkerColor(data.stationID);
    //마커 이미지 크기 표시
    var imageSize = new kakao.maps.Size(50, 50);
    // 마커 이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    var marker = new kakao.maps.Marker({
        map: map,
        position: data.latlng,
        image : markerImage // 마커 이미지
    });
    var overlay = new kakao.maps.CustomOverlay({
        yAnchor: 3,
        position: marker.getPosition()
    });

    var container = document.createElement('div');
    container.id = data.stationID;
    container.style.cssText = 'background: white; border: 1px solid black ; padding : 3px ; border-radius : 10px';

    var content = document.createElement('a');
    content.innerHTML =  data.stationName;
    content.id = data.stationID;
    content.style.cssText = 'padding : 2px';
    container.append(content);
    content.onmouseover = function(event){
        InfoShowOn(event.target.id);
    }

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
        overlay.setMap(map);
    });
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


function removeMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function removeOverlays() {
    overlays.forEach(overlay => overlay.setMap(null));
    overlays = [];
}

click1.addEventListener("click", function(){
    removeMarkers();
    removeOverlays();
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도

        var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            message = '<div style="padding:5px;">현재 위치 다시검색</div>'; // 인포윈도우에 표시될 내용입니다

        // 마커와 인포윈도우를 표시합니다
        infoInPointMarker(locPosition, message);

        // 지도 중심좌표를 접속위치로 변경합니다
        map.setCenter(locPosition);
    });
}, false);

click2.addEventListener("click", function(){
    removeMarkers();
    removeOverlays();
    const aa = calLengthByDistance();
    console.log(+aa);
}, false);

click3.addEventListener("click", function(){
    removeMarkers();
    removeOverlays();
    calLengthByAvailability();
}, false);

click4.addEventListener("click", function(){
    removeMarkers();
    removeOverlays();
    calLengthByFastCharger();
}, false);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 빈칸 우선

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

        closestStations.forEach(station => {
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
            DistanceDisplayMarker(station);
            console.log("distance to station:", station, distance);
        });
    });
    return closestStations;
}
function DistanceDisplayMarker(data) {
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    //마커 이미지 크기 표시
    var imageSize = new kakao.maps.Size(24, 35);
    // 마커 이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    var marker = new kakao.maps.Marker({
        map: map,
        position: data.latlng,
        image : markerImage // 마커 이미지
    });
    var overlay = new kakao.maps.CustomOverlay({
        yAnchor: 3,
        position: marker.getPosition()
    });

    var container = document.createElement('div');
    container.id = data.stationID;
    container.style.cssText = 'background: red; border: 1px solid black';

    var content = document.createElement('a');
    content.innerHTML =  data.stationName;
    content.id = data.stationID;
    container.append(content);
    content.onclick = function(event){
        InfoShowOn(event.target.id);
    }

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
        overlay.setMap(map);
    });


    marker.setMap(map);

    markers.push(marker);
    overlays.push(overlay);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 빈칸 우선
function calLengthByAvailability() {
    removeDuplicateStationsByAvailability();
    navigator.geolocation.getCurrentPosition(position => {
        const currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        const closestStations = findClosestStationsByAvailability(currentPosition, uniqueStationsByAvailability, 6);
        console.log("Closest 6 stations by 빈칸우선:", closestStations);

        closestStations.forEach(station => {
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
            AvailabilityDisplayMarker(station);
            console.log(`Distance to station ${station.name} (Address: ${station.stationAddress}): ${station.distance} meters, Available chargers: ${station.availableChargers}`);
        });
    });
}
function AvailabilityDisplayMarker(data) {
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    //마커 이미지 크기 표시
    var imageSize = new kakao.maps.Size(24, 35);
    // 마커 이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    var marker = new kakao.maps.Marker({
        map: map,
        position: data.latlng,
        image : markerImage // 마커 이미지
    });
    var overlay = new kakao.maps.CustomOverlay({
        yAnchor: 3,
        position: marker.getPosition()
    });

    var container = document.createElement('div');
    container.id = data.stationID;
    container.style.cssText = 'background: red; border: 1px solid black';

    var content = document.createElement('a');
    content.innerHTML =  data.stationName;
    content.id = data.stationID;
    container.append(content);
    content.onclick = function(event){
        InfoShowOn(event.target.id);
    }

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
        overlay.setMap(map);
    });


    marker.setMap(map);

    markers.push(marker);
    overlays.push(overlay);
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
        closestStations.forEach(station => {
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
            FastChargerDisplayMarker(station);
            console.log(`Distance to station ${station.name} (Address: ${station.stationAddress}): ${station.distance} meters, Available chargers: ${station.availableChargers}`);
        });
    });
}
function FastChargerDisplayMarker(data) {
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    //마커 이미지 크기 표시
    var imageSize = new kakao.maps.Size(24, 35);
    // 마커 이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    var marker = new kakao.maps.Marker({
        map: map,
        position: data.latlng,
        image : markerImage // 마커 이미지
    });
    var overlay = new kakao.maps.CustomOverlay({
        yAnchor: 3,
        position: marker.getPosition()
    });

    var container = document.createElement('div');
    container.id = data.stationID;
    container.style.cssText = 'background: red; border: 1px solid black';

    var content = document.createElement('a');
    content.innerHTML =  data.stationName;
    content.id = data.stationID;
    container.append(content);
    content.onclick = function(event){
        InfoShowOn(event.target.id);
    }

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
        overlay.setMap(map);
    });
    marker.setMap(map);

    markers.push(marker);
    overlays.push(overlay);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function infoInPointMarker(position, message) {
    var marker = new kakao.maps.Marker({
        position: position
    });

    var overlay = new kakao.maps.CustomOverlay({
        content: message,
        position: position,
        xAnchor: 0.5,
        yAnchor: 1.5
    });

    marker.setMap(map);
    overlay.setMap(map);

    markers.push(marker);
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

// 빈칸 우선 중복 제거
function removeDuplicateStationsByAvailability() {
    const stationMap = new Map();

    stations.forEach(station => {
        if (!stationMap.has(station.stationAddress)) {
            stationMap.set(station.stationAddress, {
                ...station,
                availableChargers: station.chargerStatus === 1 ? 1 : 0
            });
        } else {
            const existingStation = stationMap.get(station.stationAddress);
            existingStation.availableChargers += station.chargerStatus === 1 ? 1 : 0;
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
                    availableChargers: station.chargerStatus === 1 ? 1 : 0
                });
            } else {
                const existingStation = stationMap.get(station.stationAddress);
                existingStation.availableChargers += station.chargerStatus === 1 ? 1 : 0;
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

    uniqueStations.sort((a, b) => {
        if (a.distance === b.distance) {
            return b.availableChargers - a.availableChargers;
        }
        return a.distance - b.distance;
    });

    return uniqueStations.slice(0, numberOfStations);
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
    fetch('/updateData')
        .then(response => response.json())
        .then(data => {
            // 기존의 마커를 모두 제거합니다.
            for (let i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];

            // 새로운 마커를 찍습니다.
            for (let i = 0; i < data.length; i++) {
                let position = new kakao.maps.LatLng(data[i].lat, data[i].lng);
                let marker = new kakao.maps.Marker({
                    position: position,
                    map: map
                });
                markers.push(marker);
            }
        });
}

let countdown = 10;

// 카운트 다운을 업데이트하는 함수
function updateCountdown() {
    // HTML에서 카운트 다운을 표시하는 요소를 찾습니다.
    const countdownElement = document.querySelector('#update_time span');

    // 카운트 다운을 업데이트합니다.
    countdownElement.textContent = countdown;

    // 카운트 다운이 0이 되면 다시 10으로 설정합니다.
    if (countdown === 0) {
        countdown = 10;
    } else {
        countdown--;
    }
}

// 10초마다 refreshMarkers 함수를 호출합니다.
setInterval(refreshMarkers, 10000);