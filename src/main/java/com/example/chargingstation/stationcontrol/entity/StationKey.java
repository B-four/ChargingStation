package com.example.chargingstation.stationcontrol.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Data
@Embeddable
public class StationKey implements Serializable
{
    private String statId;
    private String chgerId;
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StationKey that = (StationKey) o;
        return Objects.equals(statId, that.statId) &&
               Objects.equals(chgerId, that.chgerId);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(statId, chgerId);
    }
}
