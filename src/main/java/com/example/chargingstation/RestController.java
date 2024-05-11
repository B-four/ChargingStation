package com.example.chargingstation;

import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
@org.springframework.web.bind.annotation.RestController
public class RestController {
    private final DatabaseService databaseService;
    List<ChargingStationInfoDTO> stations;

    public RestController(DatabaseService databaseService)
    {
        this.databaseService = databaseService;
        this.stations = databaseService.fetchAllData();
    }
    @GetMapping("/positionList")
    public List<Position> getPositions() {

        // Position 객체 리스트를 반환합니다.
        // 실제로는 데이터베이스에서 조회하거나 다른 로직을 통해 생성할 수 있습니다.
        List<Position> positionList = new ArrayList<>();
        for (ChargingStationInfoDTO station : stations) {
            positionList.add(station.getPosition());
        }

        return positionList;
    }


}
