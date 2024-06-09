package com.example.chargingstation.usercontrol.repository;

import com.example.chargingstation.stationcontrol.entity.Station;
import com.example.chargingstation.usercontrol.entity.Bookmark;
import com.example.chargingstation.usercontrol.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByUserAndStation(User user, Station station);
    List<Bookmark> findByUser(User user);
}