package com.example.chargingstation.stationcontrol;

public enum StatusEnum
{
    COMMUNICATION_ABNORMALITY, // 통신이상
    RECHARGEABLE_WAITING, // 충전대기
    CHARGING, // 충전중
    SUSPENSION_OF_OPERATION, // 운영중지
    UNDER_INSPECTION, // 점검중
    UNCHECKED_STATUS // 상태미확인
}