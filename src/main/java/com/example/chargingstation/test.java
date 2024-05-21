package com.example.chargingstation;

import com.example.chargingstation.XmlMapping.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class test {

    private DatabaseService databaseService;

    public test() {

    }

    @Autowired
    public test(DatabaseService databaseService) {
        this.databaseService = databaseService;
    }

    public void test2() {
        List<ChargingStationInfoDTO> data = databaseService.fetchAllData();
        for (ChargingStationInfoDTO row : data) {
            System.out.println(row.getStationName());
        }

    }

    public void test3()
    {
        List<ChargingStationInfoDTO> data = databaseService.fetchNearbyData(35.254646, 128.639178);
        for (ChargingStationInfoDTO row : data) {
            System.out.println(row.getStationName() + " / " +row.getStationAddress());
        }
    }

    public void test4(Response response){
        databaseService.readApiUpdateDB(response);
    }
}

// commit and push test