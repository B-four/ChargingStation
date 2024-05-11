package com.example.chargingstation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.io.IOException;

@SpringBootApplication
public class ChargingStationApplication {
    public static void main(String[] args) throws IOException {
        api apiInstance = new api();

        ConfigurableApplicationContext context = SpringApplication.run(ChargingStationApplication.class, args);
        test test = context.getBean(test.class);
        test.test4(apiInstance.readApi());
    }

}
