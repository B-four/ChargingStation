package com.example.chargingstation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.io.IOException;

@SpringBootApplication
public class ChargingStationApplication {
    public static void main(String[] args) throws IOException {
        api apiInstance = new api();
        apiInstance.readApi();

        ConfigurableApplicationContext context = SpringApplication.run(ChargingStationApplication.class, args);
        test testInstance = context.getBean(test.class);
        testInstance.test3();
    }

}
