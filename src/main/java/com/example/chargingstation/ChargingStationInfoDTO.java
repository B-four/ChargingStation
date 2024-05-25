package com.example.chargingstation;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class ChargingStationInfoDTO implements Serializable {
    private String stationAddress;           // 충전소 주소
    private int chargerType;                 // 1 : 완속, 2 : 급속
    private int chargerID;                   // 충전기 ID (충전소1의 충전기1, 충전기2, ...)
    private String ChargerName;              // 충전소 명칭
    private int chargerStatus;               // 0 : 상태확인불가, 1 : 충전가능, 2: 충전중, 3 : 통신장애, 4 : 통신미연결, 9 : 충전예약
    private int chargerTerminal;             // 1 : B타입(5핀), 2 : C타입(5핀), 3 : BC타입(5핀), 4 : BC타입(7핀), 5 : DC차데모, 6 : AC3상
    private int stationID;                   // 충전소 ID
    private String stationName;              // 충전소 명칭
    private double stationLatitude;          // 경도
    private double stationLongitude;         // 위도
    private LocalDateTime status_UpdateTime; // 충전기 상태 갱신 시각

    public Position getPosition() {
        return new Position(this);
    }
}