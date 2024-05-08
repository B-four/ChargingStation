//==================================================
// custom Func

// 임시
document.getElementById("click1").addEventListener("click", function(){
    InfoShowOn();
},false)

// 충전소 정보 업데이트
function UpdateInfo(){

}
// 충전소 정보 인터페이스 스윕
function InfoShowOn(){
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

///////////////////////////////////////////////////// 마커를 표시할 위치와 title 객체 배열입니다 
var positions = [
    {
        title: '디관 충전소', 
        latlng: new kakao.maps.LatLng(36.145346, 128.392459)
    },
    {
        title: '도서관 충전소', 
        latlng: new kakao.maps.LatLng(36.145980, 128.394388)
    },
    {
        title: '주차장 충전소', 
        latlng: new kakao.maps.LatLng(36.142434, 128.394081)
    },
    {
        title: '본관 충전소',
        latlng: new kakao.maps.LatLng(36.145122, 128.393061)
    }
];

// 마커 이미지의 이미지 주소입니다

// var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 
 
// for (var i = 0; i < positions.length; i ++) {
    
//     // 마커 이미지의 이미지 크기 입니다
//     var imageSize = new kakao.maps.Size(24, 35); 
    
//     // 마커 이미지를 생성합니다
//     var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
    
//     // 마커를 생성합니다
//     var marker = new kakao.maps.Marker({
//         map: map, // 마커를 표시할 지도
//         position: positions[i].latlng, // 마커의 위치
//         title : positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
//         image : markerImage // 마커 이미지 
//     });

//     // 마커에 표시할 인포윈도우를 생성합니다 
//     var overlay = new kakao.maps.CustomOverlay({
//         content: positions[i].content,
//         map: map,
//         position: marker.getPosition()
//     });
    
//     overlay.setMap(null);
    

//     // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
//     // 이벤트 리스너로는 클로저를 만들어 등록합니다 
//     //for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
//     kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, overlay));
//     kakao.maps.event.addListener(marker, "click", closeOverlay());
    
// }


for(let i=0; i < positions.length; i++){
    var data = positions[i];
    displayMarker(data);
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
    
    var content = document.createElement('div');
    content.innerHTML =  data.title;
    content.style.cssText = 'background: white; border: 1px solid black';
    
    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '닫기';
    closeBtn.onclick = function () {
        overlay.setMap(null);
    };
    content.appendChild(closeBtn);
    overlay.setContent(content);

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

