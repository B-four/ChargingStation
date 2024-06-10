package com.example.chargingstation.usercontrol.entity;

import com.example.chargingstation.stationcontrol.entity.Station;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Entity
@ToString
public class Bookmark
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "statId", referencedColumnName = "station_id"),
            @JoinColumn(name = "chgerId", referencedColumnName = "chger_id")
    })
    private Station station;
}