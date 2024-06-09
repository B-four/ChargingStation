package com.example.chargingstation.stationcontrol.repository;

import com.example.chargingstation.stationcontrol.entity.Station;
import com.example.chargingstation.stationcontrol.entity.StationKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StationRepository extends JpaRepository<Station, StationKey> {
    @Query(value = "SELECT *, " +
                   "(6371 * acos(cos(radians(:latitude)) * cos(radians(lat)) * cos(radians(lng) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(lat)))) AS distance " +
                   "FROM env_charging_station_info " +
                   "WHERE (6371 * acos(cos(radians(:latitude)) * cos(radians(lat)) * cos(radians(lng) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(lat)))) < 10 " +  // 예시: 10km 내의 충전소만 선택
                   "ORDER BY distance " +
                   "LIMIT 1000", nativeQuery = true)
    List<Station> findNearbyStations(@Param("latitude") double latitude, @Param("longitude") double longitude);
    Station findByStatId(String statId);

    Station findByStatIdAndChgerId(String statId, String chgerId);
}