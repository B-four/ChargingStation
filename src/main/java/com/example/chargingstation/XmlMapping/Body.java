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
public class Body {
    @XmlElement(name = "items")
    private Items items;
}
