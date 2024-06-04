package com.example.chargingstation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@Controller
public class ChargingStationController {
    private final DatabaseService databaseService;

    @Autowired
    public ChargingStationController(DatabaseService databaseService)
    {
        this.databaseService = databaseService;
    }

    @GetMapping("/")
    public String getStations(Model model) {
        List<ChargingStationInfoDTO> stations = databaseService.fetchAllData();
        model.addAttribute("stations", stations);
        return "/ElCh";
    }

}