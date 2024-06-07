package com.example.chargingstation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChargerInfoItemRepository extends JpaRepository<ChargerInfoItem, ChargerInfoItemKey> {
}