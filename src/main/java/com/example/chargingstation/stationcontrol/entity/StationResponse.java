package com.example.chargingstation.stationcontrol.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StationResponse
{
    private String resultMsg;
    private int totalCount;
    private Stations items;
}