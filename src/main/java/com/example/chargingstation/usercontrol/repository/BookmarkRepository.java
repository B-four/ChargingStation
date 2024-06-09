package com.example.chargingstation.usercontrol.repository;

import com.example.chargingstation.stationcontrol.entity.Station;
import com.example.chargingstation.usercontrol.entity.Bookmark;
import com.example.chargingstation.usercontrol.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByUserAndStation(User user, Station station);
}