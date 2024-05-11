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
    private String stationAddress;
    private int chargerType;
    private int chargerID;
    private String ChargerName;
    private int chargerStatus;
    private int chargerTerminal;
    private int stationID;
    private String stationName;
    private double stationLatitude;
    private double stationLongitude;
    private LocalDateTime status_UpdateTime;

    public Position getPosition() {
        return new Position(this);
    }
}