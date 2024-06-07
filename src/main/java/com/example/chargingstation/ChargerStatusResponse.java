package com.example.chargingstation;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class ChargerStatusResponse {
    private String resultMsg;
    private int totalCount;
    private ChargerStatusItems items;

    // Getters and setters
}

@Setter
@Getter
class ChargerStatusItems {
    private List<ChargerStatusItem> item;

    // Getters and setters
}

@Setter
@Getter
class ChargerStatusItem {
    private String busiId;
    private String statId;
    private String chgerId;
    private String stat;
    private String statUpdDt;
    private String lastTsdt;
    private String lastTedt;
    private String nowTsdt;

    // Getters and setters
}