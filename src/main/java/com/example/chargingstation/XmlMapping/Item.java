package com.example.chargingstation.XmlMapping;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

@Getter
@Setter
@ToString
@XmlAccessorType(XmlAccessType.FIELD)
public class Item {
    @XmlElement(name = "addr")
    private String stationAddress;
    @XmlElement(name = "chargeTp")
    private int chargerType;
    @XmlElement(name = "cpId")
    private int chargerID;
    @XmlElement(name = "cpNm")
    private String chargerName;
    @XmlElement(name = "cpStat")
    private int chargerStatus;
    @XmlElement(name = "cpTp")
    private int chargerTerminal;
    @XmlElement(name = "csId")
    private int stationID;
    @XmlElement(name = "csNm")
    private String stationName;
    @XmlElement(name = "lat")
    private double stationLatitude;
    @XmlElement(name = "longi")
    private double stationLongitude;
    @XmlElement(name = "statUpdateDatetime")
    private String status_UpdateTime;
}