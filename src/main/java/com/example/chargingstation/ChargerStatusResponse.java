package com.example.chargingstation;

import java.util.List;

public class ChargerStatusResponse {
    private String resultMsg;
    private int totalCount;
    private List<ChargerStatusItem> items;

    // Getters and setters

    public static class ChargerStatusItem {
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

    // Getters and setters
}
