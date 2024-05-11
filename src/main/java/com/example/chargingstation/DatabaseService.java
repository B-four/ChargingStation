package com.example.chargingstation;

import com.example.chargingstation.XmlMapping.Item;
import com.example.chargingstation.XmlMapping.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class DatabaseService {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DatabaseService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ChargingStationInfoDTO> fetchAllData() {
        return jdbcTemplate.query("SELECT * FROM charging_station_info ORDER BY station_id ASC", (rs, rowNum) -> {
            ChargingStationInfoDTO chargingStationInfoDTO = new ChargingStationInfoDTO();
            chargingStationInfoDTO.setStationAddress(rs.getString("address"));
            chargingStationInfoDTO.setChargerType(rs.getInt("charger_type"));
            chargingStationInfoDTO.setChargerID(rs.getInt("charger_id"));
            chargingStationInfoDTO.setChargerName(rs.getString("charger_name"));
            chargingStationInfoDTO.setChargerStatus(rs.getInt("charger_status"));
            chargingStationInfoDTO.setChargerTerminal(rs.getInt("charger_terminal"));
            chargingStationInfoDTO.setStationID(rs.getInt("station_id"));
            chargingStationInfoDTO.setStationName(rs.getString("station_name"));
            chargingStationInfoDTO.setStationLatitude(rs.getDouble("lat"));
            chargingStationInfoDTO.setStationLongitude(rs.getDouble("longi"));
            chargingStationInfoDTO.setStatus_UpdateTime(rs.getTimestamp("status_updatetime").toLocalDateTime());
            return chargingStationInfoDTO;
        });
    }

    public List<ChargingStationInfoDTO> fetchNearbyData(double latitude, double longitude) {
        double range = 0.005; // You can adjust this value
        return jdbcTemplate.query(
                "SELECT * FROM charging_station_info WHERE lat BETWEEN ? AND ? AND longi BETWEEN ? AND ?",
                new Object[]{latitude - range, latitude + range, longitude - range, longitude + range},
                (rs, rowNum) -> {
                    ChargingStationInfoDTO chargingStationInfoDTO = new ChargingStationInfoDTO();
                    chargingStationInfoDTO.setStationAddress(rs.getString("address"));
                    chargingStationInfoDTO.setChargerType(rs.getInt("charger_type"));
                    chargingStationInfoDTO.setChargerID(rs.getInt("charger_id"));
                    chargingStationInfoDTO.setChargerName(rs.getString("charger_name"));
                    chargingStationInfoDTO.setChargerStatus(rs.getInt("charger_status"));
                    chargingStationInfoDTO.setChargerTerminal(rs.getInt("charger_terminal"));
                    chargingStationInfoDTO.setStationID(rs.getInt("station_id"));
                    chargingStationInfoDTO.setStationName(rs.getString("station_name"));
                    chargingStationInfoDTO.setStationLatitude(rs.getDouble("lat"));
                    chargingStationInfoDTO.setStationLongitude(rs.getDouble("longi"));
                    chargingStationInfoDTO.setStatus_UpdateTime(rs.getTimestamp("status_updatetime").toLocalDateTime());
                    return chargingStationInfoDTO;
                }
        );
    }

    public void readApiUpdateDB(Response response){
        List<Item> item = response.getBody().getItems().getItem();
        for (Item i : item) {
            String sql = "INSERT INTO charging_station_info (address, charger_type, charger_id, charger_name, charger_status, charger_terminal, station_id, station_name, lat, longi, status_updatetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, i.getStationAddress(), i.getChargerType(), i.getChargerID(), i.getChargerName(), i.getChargerStatus(), i.getChargerTerminal(), i.getStationID(), i.getStationName(), i.getStationLatitude(), i.getStationLongitude(), i.getStatus_UpdateTime());
        }
    }
}
