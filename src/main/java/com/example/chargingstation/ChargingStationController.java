package com.example.chargingstation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class ChargingStationController
{
    @GetMapping("/")
    public String getStations() {
        return "/ElCh";
    }
    @GetMapping("/login")
    public String getLogin() {
        return "/login";
    }
}