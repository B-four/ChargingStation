package com.example.chargingstation.stationcontrol.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Data
@Embeddable
public class StationKey implements Serializable
{
    private String statId;
    private String chgerId;
}
