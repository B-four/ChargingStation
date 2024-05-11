package com.example.chargingstation;

import lombok.Getter;

import java.util.List;

@Getter
public class Position {
    private String name;
    private final double latitude;
    private final double longitude;

    public Position(String name,double latitude, double longitude) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Position(ChargingStationInfoDTO stations) {
        this.name = stations.getStationName();
        this.latitude = stations.getStationLatitude();
        this.longitude = stations.getStationLongitude();
    }

}
