package com.example.chargingstation;

import com.example.chargingstation.XmlMapping.Item;
import com.example.chargingstation.XmlMapping.Response;
import org.springframework.stereotype.Component;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.net.http.HttpClient;

@Component
public class api {
    private static final HttpClient httpClient = HttpClient.newHttpClient();
    public Response readApi() throws IOException {
        StringBuilder urlBuilder = new StringBuilder("http://openapi.kepco.co.kr/service/EvInfoServiceV2/getEvSearchList"); //*//*URL*//*
        urlBuilder.append("?" + URLEncoder.encode("serviceKey","UTF-8") + "=31CcKv%2BKhtHZBXu42U3lWoa2ZKMVJb7UqwkIf3sKt14hQ31xoAuvKsFBU4XCd%2FcfudH7%2B0oDm2RD09QFkq%2Feng%3D%3D"); //*//*Service Key*//*
        urlBuilder.append("&" + URLEncoder.encode("pageNo","UTF-8") + "=" + URLEncoder.encode("1", "UTF-8")); //*//*페이지번호*//*
        urlBuilder.append("&" + URLEncoder.encode("numOfRows","UTF-8") + "=" + URLEncoder.encode("5000", "UTF-8")); //*//*한 페이지 결과 수*//*

        URL url = new URL(urlBuilder.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");
        System.out.println("Response code: " + conn.getResponseCode());
        BufferedReader rd;
        if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
            rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        } else {
            rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
        }
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }
        rd.close();
        conn.disconnect();

        String xml = sb.toString();
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(Response.class);
            Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();

            StringReader reader = new StringReader(xml);
            Response response = (Response) unmarshaller.unmarshal(reader);

            return response;
        } catch (JAXBException e) {
            e.printStackTrace();
        }
        return null;
    }

}


