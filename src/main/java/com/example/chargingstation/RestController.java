package com.example.chargingstation;

import com.example.chargingstation.XmlMapping.Response;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
@org.springframework.web.bind.annotation.RestController
public class RestController {
    private final DatabaseService databaseService;
    private final api apiInstance;
    List<ChargingStationInfoDTO> stations;

    public RestController(DatabaseService databaseService1, DatabaseService databaseService, api apiInstance)
    {
        this.databaseService = databaseService;
        this.stations = databaseService.fetchAllData();
        this.apiInstance = apiInstance;
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

    @GetMapping("/stationList")
    public List<ChargingStationInfoDTO> getStations() {
        return stations;
    }
    
    @GetMapping("/updateData")
    public List<Position> updateData() throws IOException
    { // IOException을 처리하도록 메서드 선언을 수정합니다.
        Response response = apiInstance.readApi(); // apiInstance.readApi()를 호출하여 Response 객체를 생성합니다.
        
        test testObject = new test(databaseService);
        testObject.test4(response);
        List<Position> updatedPositions = getPositions();
        return updatedPositions;
    }
}
