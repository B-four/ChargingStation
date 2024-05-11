package com.example.chargingstation.XmlMapping;

import lombok.Getter;
import lombok.Setter;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

@Getter
@Setter
@XmlAccessorType(XmlAccessType.FIELD)
public class Header {
    @XmlElement(name = "resultCode")
    private String resultCode;
    @XmlElement(name = "resultMsg")
    private String resultMsg;
    // getters and setters
}
