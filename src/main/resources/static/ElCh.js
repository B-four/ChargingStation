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
// 충전소 정보 인터페이스 스윕
function InfoShowOn(stationID){
    let data = UpdateInfo(stationID);
    document.getElementById("name_text1").innerHTML = data[0].stationName;
    document.getElementById("name_text2").innerHTML = data[0].stationAddress;
    var slow_using_num = 0;
    var slow_all_num= 0;
    var fast_using_num=0;
    var fast_all_num=0;
    data.forEach(function(item, index) {
        if (item.chargerType == 1) {
            slow_all_num++;
            if (item.chargerStatus != 1){
                slow_using_num++;
            }
        }
        if (item.chargerType == 2) {
            fast_all_num++;
            if (item.chargerStatus != 1){
                fast_using_num++;
            }
        }
    });
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

var stations = [];

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
    container.style.cssText = 'background: white; border: 1px solid black';

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
}

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
click2.addEventListener("click",function(){
    console.log("mmm");

    // // 마커와 인포윈도우를 표시합니다
    // pointMarker(p1, message);
    var p1 = new kakao.maps.LatLng(36.145357, 128.392559); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
    var polygon = new kakao.maps.Polygon({
        path: [
            new kakao.maps.LatLng(33.452344169439975, 126.56878163224233),
            new kakao.maps.LatLng(33.452739313807456, 126.5709308145358)
        ]
    });

    //path배열 추가
    var path = polygon.getPath();
    // 좌표 배열에 클릭한 위치를 추가합니다
    path.push(p1);
    polygon.setPath(path);


    var distance = Math.round(polygon.getLength()), // 선의 총 거리를 계산합니다
        message = '<div class="dotOverlay distanceInfo">총거리 <span class="number">' + distance + '</span>m</div>'; // 커스텀오버레이에 추가될 내용입니다
    pointMarker(p1, message);
    console.log(distance);

},false)
