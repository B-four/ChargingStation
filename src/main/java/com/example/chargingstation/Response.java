package com.example.chargingstation;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;


@Getter
@Setter
@ToString
@XmlRootElement(name = "response")
@XmlAccessorType(XmlAccessType.FIELD)
public class Response {
    @XmlElement(name = "header")
    private Body.Header header;

    @XmlElement(name = "body")
    private Body body;

    @Getter
    @Setter
    @ToString
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class Body {
        @XmlElement(name = "items")
        private Items items;

        @Getter
        @Setter
        @XmlAccessorType(XmlAccessType.FIELD)
        static
        class Header {
            @XmlElement(name = "resultCode")
            private String resultCode;
            @XmlElement(name = "resultMsg")
            private String resultMsg;
            // getters and setters
        }

        @Getter
        @Setter
        @ToString
        @XmlAccessorType(XmlAccessType.FIELD)
        public static class Item {
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

        @Getter
        @Setter
        @XmlAccessorType(XmlAccessType.FIELD)
        public static class Items {
            @XmlElement(name = "item")
            private List<Item> item;
            // getters and setters
        }
    }
}
