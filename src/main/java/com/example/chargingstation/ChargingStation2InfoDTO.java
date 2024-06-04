package com.example.chargingstation;

import java.time.LocalDateTime;

public class ChargingStation2InfoDTO
{
    private String stationName;
    private int stationID; // 충전소 ID
    private int chargerID; // 충전기 ID
    private int chargerType; // 충전기 타입
    private String stationAddress; // 충전소 주소
    private String location; // 상세위치
    private double stationLatitude; // 위도
    private double stationLongitude; // 경도
    private String useTime; // 이용시간
    private String busiID; // 기관 ID
    private String bNm; // 기관명
    private String busiName; // 운영기관명
    private String busiCall; // 운영기관 연락처
    private int chargerStatus; // 충전기 상태
    private LocalDateTime status_UpdateTime; // 충전기 상태 갱신 시각
    private LocalDateTime lastTsdt; // 마지막 충전 시작일시
    private LocalDateTime lastTedt; // 마지막 충전 종료일시
    private LocalDateTime nowTsdt; // 충전중 시작일시
    private int output; // 출전용량
    private String method; // 충전 방식
    private int zcode; // 지역코드
    private int zscode; // 지역구분 상세코드
    private String kind; // 충전소 구분 코드
    private String kindDetail; // 충전소 구분 상세코드
    private Boolean parkingFree; // 주차료무료
    private String note; // 충전소 안내
    private Boolean limitYn; // 이용자 제한
    private String limitDetail; // 이용제한 사유
    private Boolean delTn; // 충전기 삭제 여부
    private String delDetail; // 충전기 삭제 사유
    private Boolean trafficYn; // 편의제공 여부
    
}
