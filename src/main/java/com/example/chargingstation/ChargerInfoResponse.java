package com.example.chargingstation;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
public class ChargerInfoResponse {
    private String resultMsg;
    private int totalCount;
    private ChargerInfoItems items;
}

@Getter
@Setter
class ChargerInfoItems {
    private List<ChargerInfoItem> item;
}
@Getter
@Setter
@Entity
@Table(name = "charger_info_2")
@IdClass(ChargerInfoItemKey.class)
class ChargerInfoItem {
    @Id
    @Column(name = "station_id")
    private String statId; // 충전소 ID

    @Id
    @Column(name = "chger_id")
    private String chgerId; // 충전기 ID

    @Column(name = "stat_nm")
    private String statNm; // 충전소 이름

    @Column(name = "chger_type")
    private String chgerType; // 충전기 타입

    @Column(name = "addr")
    private String addr; // 충전소 주소

    @Column(name = "location")
    private String location; // 상세 위치

    @Column(name = "lat")
    private double lat; // 위도

    @Column(name = "lng")
    private double lng; // 경도

    @Column(name = "use_time")
    private String useTime; // 이용 시간

    @Column(name = "busi_id")
    private String busiId; // 운영 기관 ID

    @Column(name = "bnm")
    private String bnm; // 운영 기관명

    @Column(name = "busi_nm")
    private String busiNm; // 운영 기관명

    @Column(name = "busi_call")
    private String busiCall; // 운영 기관 연락처

    @Column(name = "stat")
    private int stat; // 충전기 상태

    @Column(name = "stat_upd_dt")
    private String statUpdDt; // 충전기 상태 갱신 시각

    @Column(name = "last_tsdt")
    private String lastTsdt; // 마지막 충전 시작 일시

    @Column(name = "last_tedt")
    private String lastTedt; // 마지막 충전 종료 일시

    @Column(name = "now_tsdt")
    private String nowTsdt; // 충전 중 시작 일시

    @Column(name = "output")
    private int output; // 출력 용량

    @Column(name = "method")
    private String method; // 충전 방식

    @Column(name = "zcode")
    private int zcode; // 지역 코드

    @Column(name = "zscode")
    private int zscode; // 지역 구분 상세 코드

    @Column(name = "kind")
    private String kind; // 충전소 구분 코드

    @Column(name = "kind_detail")
    private String kindDetail; // 충전소 구분 상세 코드

    @Column(name = "parking_free")
    private Boolean parkingFree; // 주차료 무료 여부

    @Column(name = "note")
    private String note; // 충전소 안내

    @Column(name = "limit_yn")
    private Boolean limitYn; // 이용자 제한 여부

    @Column(name = "limit_detail")
    private String limitDetail; // 이용 제한 사유

    @Column(name = "del_yn")
    private Boolean delYn; // 충전기 삭제 여부

    @Column(name = "del_detail")
    private String delDetail; // 충전기 삭제 사유

    @Column(name = "traffic_yn")
    private Boolean trafficYn; // 편의 제공 여부
}

@Data
@Embeddable
class ChargerInfoItemKey implements Serializable {
    private String  statId;
    private String  chgerId;
    // Getters and setters
}