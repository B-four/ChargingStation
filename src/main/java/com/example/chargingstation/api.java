package com.example.chargingstation;

import com.example.chargingstation.stationcontrol.entity.Station;
import com.example.chargingstation.stationcontrol.entity.StationResponse;
import com.example.chargingstation.stationcontrol.repository.StationRepository;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;


@Component
public class api
{
    @Autowired
    private StationRepository chargerInfoItemRepository;

    @Scheduled(fixedRate = 300000) // 5분(300,000밀리초)마다 실행
    public void api2ReadPaged() throws IOException {
        int pageNo = 1;
        int numOfRows = 9999;
        boolean hasMoreData = true;
        Gson gson = new Gson();

        while (hasMoreData) {
            try {
                StringBuilder urlBuilder = new StringBuilder("http://apis.data.go.kr/B552584/EvCharger/getChargerStatus");
                urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8") + "=31CcKv%2BKhtHZBXu42U3lWoa2ZKMVJb7UqwkIf3sKt14hQ31xoAuvKsFBU4XCd%2FcfudH7%2B0oDm2RD09QFkq%2Feng%3D%3D");
                urlBuilder.append("&" + URLEncoder.encode("pageNo", "UTF-8") + "=" + URLEncoder.encode(String.valueOf(pageNo), "UTF-8"));
                urlBuilder.append("&" + URLEncoder.encode("numOfRows", "UTF-8") + "=" + URLEncoder.encode(String.valueOf(numOfRows), "UTF-8"));
                urlBuilder.append("&" + URLEncoder.encode("dataType", "UTF-8") + "=" + URLEncoder.encode("JSON", "UTF-8"));

                URL url = new URL(urlBuilder.toString());
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Content-type", "application/json");
                conn.setConnectTimeout(5000); // 연결 시간 제한 설정
                conn.setReadTimeout(5000);    // 읽기 시간 제한 설정
                System.out.println("Response code: " + conn.getResponseCode());
                BufferedReader rd;
                if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
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

                // JSON 데이터를 검증 및 정제
                String jsonString = sb.toString();
                jsonString = jsonString.replaceAll(":\"\",", ":\"0\",");
                jsonString = jsonString.replaceAll(":\"\"}", ":\"0\"}");

                // JSON 데이터를 Java 객체로 매핑
                StationResponse response = gson.fromJson(jsonString, StationResponse.class);
                List<Station> items = response.getItems().getItem();

                // 유효성 검사 및 필터링
                items.removeIf(item -> item.getChgerId() == null || item.getStatId() == null);

                // 데이터 업데이트
                for (Station item : items) {
                    Station existingItem = chargerInfoItemRepository.findByStatIdAndChgerId(item.getStatId(), item.getChgerId());

                    if (existingItem != null) {
                        // 기존 데이터가 있는 경우, 업데이트할 컬럼만 갱신
                        existingItem.setChgerType(item.getChgerType());
                        existingItem.setStat(item.getStat());
                        existingItem.setStatUpdDt(item.getStatUpdDt());
                        existingItem.setOutput(item.getOutput());
                        chargerInfoItemRepository.save(existingItem);
                    } else {
                        // 기존 데이터가 없는 경우 새로 추가
                        chargerInfoItemRepository.save(item);
                    }
                }

                // 더 이상 가져올 데이터가 없으면 루프 종료
                hasMoreData = items.size() == numOfRows;
                pageNo++;
            } catch (IOException e) {
                System.err.println("Error occurred: " + e.getMessage());
                // 재시도 로직 또는 다음 페이지 시도
                try {
                    Thread.sleep(10000); // 10초 대기 후 재시도
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }



    public void api2read1() throws IOException {
        int pageNo = 1;
        int numOfRows = 9999;
        boolean hasMoreData = true;

        Gson gson = new Gson();

        while (hasMoreData) {
            try {
                StringBuilder urlBuilder = new StringBuilder("http://apis.data.go.kr/B552584/EvCharger/getChargerInfo");
                urlBuilder.append("?" + URLEncoder.encode("serviceKey", "UTF-8") + "=31CcKv%2BKhtHZBXu42U3lWoa2ZKMVJb7UqwkIf3sKt14hQ31xoAuvKsFBU4XCd%2FcfudH7%2B0oDm2RD09QFkq%2Feng%3D%3D");
                urlBuilder.append("&" + URLEncoder.encode("pageNo", "UTF-8") + "=" + URLEncoder.encode(String.valueOf(pageNo), "UTF-8"));
                urlBuilder.append("&" + URLEncoder.encode("numOfRows", "UTF-8") + "=" + URLEncoder.encode(String.valueOf(numOfRows), "UTF-8"));
                urlBuilder.append("&" + URLEncoder.encode("dataType", "UTF-8") + "=" + URLEncoder.encode("JSON", "UTF-8"));

                URL url = new URL(urlBuilder.toString());
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Content-type", "application/json");
                conn.setConnectTimeout(5000); // 연결 시간 제한 설정
                conn.setReadTimeout(5000);    // 읽기 시간 제한 설정
                System.out.println("Response code: " + conn.getResponseCode());
                BufferedReader rd;
                if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
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

                // JSON 데이터를 검증 및 정제
                String jsonString = sb.toString();
                jsonString = jsonString.replaceAll(":\"\",", ":\"0\",");
                jsonString = jsonString.replaceAll(":\"\"}", ":\"0\"}");

                // JSON 데이터를 Java 객체로 매핑
                StationResponse response = gson.fromJson(jsonString, StationResponse.class);
                List<Station> items = response.getItems().getItem();

                // 유효성 검사 및 필터링
                items.removeIf(item -> item.getChgerId() == null || item.getStatId() == null);

                // 배치 저장
                int batchSize = 1000; // 배치 크기 설정
                for (int i = 0; i < items.size(); i += batchSize) {
                    int end = Math.min(items.size(), i + batchSize);
                    List<Station> batchList = items.subList(i, end);
                    chargerInfoItemRepository.saveAll(batchList);
                    System.out.println("Saved items from index " + i + " to " + end);
                }

                // 더 이상 가져올 데이터가 없으면 루프 종료
                hasMoreData = items.size() == numOfRows;
                pageNo++;
            } catch (IOException e) {
                System.err.println("Error occurred: " + e.getMessage());
                // 재시도 로직 또는 다음 페이지 시도
                try {
                    Thread.sleep(10000); // 10초 대기 후 재시도
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }
}
