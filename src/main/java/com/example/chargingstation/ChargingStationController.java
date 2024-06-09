package com.example.chargingstation;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ChargingStationController
{
    @GetMapping("/")
    public String getStations() {
        return "/ElCh";
    }
}