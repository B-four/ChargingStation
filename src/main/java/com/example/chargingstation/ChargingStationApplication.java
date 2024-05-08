package com.example.chargingstation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class ChargingStationApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(ChargingStationApplication.class, args);
        test testInstance = context.getBean(test.class);
        testInstance.test1();

        SpringApplication.run(ChargingStationApplication.class, args);
    }

}
