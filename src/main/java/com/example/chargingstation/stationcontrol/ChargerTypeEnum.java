package com.example.chargingstation.stationcontrol;

public enum ChargerTypeEnum
{
    DC_CHADEMO, // DC 차데모
    AC_SLOW_SPEED, // AC 완속
    DC_CHADEMO_AND_AC3PHASE, // DC 차데모 + AC3상
    DC_COMBO, // DC 콤보
    DC_CHADEMO_AND_DC_COMBO, // DC 차데모 + DC 콤보
    DC_CHADEMO_AND_AC3_PHASE_AND_DC_COMBO, // DC 차데모 + AC3상 + DC 콤보
    AC3_PHASE, // AC3상
    DC_COMBO_SLOW // DC 콤보 (완속)
}