package com.example.chargingstation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChargerInfoItemRepository extends JpaRepository<ChargerInfoItem, ChargerInfoItemKey> {
    @Query(value = "SELECT *, " +
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(lat)) * cos(radians(lng) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(lat)))) AS distance " +
            "FROM env_charging_station_info " +
            "HAVING distance < 10 " +  // 예시: 10km 내의 충전소만 선택
            "ORDER BY distance " +
            "LIMIT 10000", nativeQuery = true)
    List<ChargerInfoItem> findNearbyStations(@Param("latitude") double latitude, @Param("longitude") double longitude);

}