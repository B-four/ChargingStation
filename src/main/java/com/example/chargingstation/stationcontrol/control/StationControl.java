package com.example.chargingstation.stationcontrol.control;

import com.example.chargingstation.stationcontrol.entity.Station;
import com.example.chargingstation.stationcontrol.repository.StationRepository;
import com.example.chargingstation.stationcontrol.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chargers")
public class StationControl
{
    private final StationService stationService;
    private final StationRepository stationRepository;
    
    @Autowired
    public StationControl(StationService stationService, StationRepository stationRepository) {
        this.stationService = stationService;
        this.stationRepository = stationRepository;
    }
    
    @GetMapping("/updateData")
    public List<Station> getAllStations() {
        return stationService.getAllStations();
    }
    
    @GetMapping("/stationList")
    public List<Station> getStations() {
        return stationService.getStations();
    }
    
    @GetMapping("/nearbyList")
    public List<Station> getNearbyStations(@RequestParam double latitude, @RequestParam double longitude) {
        List<Station> nearbyStations = stationRepository.findNearbyStations(latitude, longitude);
        return nearbyStations;
    }
}