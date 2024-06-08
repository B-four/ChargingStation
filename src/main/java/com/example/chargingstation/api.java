package com.example.chargingstation;

import com.example.chargingstation.stationcontrol.entity.Station;
import com.example.chargingstation.stationcontrol.entity.StationResponse;
import com.example.chargingstation.stationcontrol.repository.StationRepository;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
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

    public void api2Read() throws IOException {
        StringBuilder urlBuilder = new StringBuilder("http://apis.data.go.kr/B552584/EvCharger/getChargerStatus"); /*URL*/
        urlBuilder.append("?" + URLEncoder.encode("serviceKey","UTF-8") + "=31CcKv%2BKhtHZBXu42U3lWoa2ZKMVJb7UqwkIf3sKt14hQ31xoAuvKsFBU4XCd%2FcfudH7%2B0oDm2RD09QFkq%2Feng%3D%3D"); /*Service Key*/
        urlBuilder.append("&" + URLEncoder.encode("pageNo","UTF-8") + "=" + URLEncoder.encode("1", "UTF-8")); /*페이지 번호*/
        urlBuilder.append("&" + URLEncoder.encode("numOfRows","UTF-8") + "=" + URLEncoder.encode("9999", "UTF-8")); /*한 페이지 결과 수 (최소 10, 최대 9999)*/
        //urlBuilder.append("&" + URLEncoder.encode("period","UTF-8") + "=" + URLEncoder.encode("5", "UTF-8")); /*상태갱신 조회 범위(분) (기본값 5, 최소 1, 최대 10)*/
        //urlBuilder.append("&" + URLEncoder.encode("zcode","UTF-8") + "=" + URLEncoder.encode("11", "UTF-8")); /*시도 코드 (행정구역코드 앞 2자리)*/
        urlBuilder.append("&"+URLEncoder.encode("dataType")+"="+URLEncoder.encode("JSON","UTF-8")); /*JSON 타입으로 호출할 경우 추가*/

        String josonurl = urlBuilder.toString();
        System.out.println(josonurl);
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
        System.out.println(sb.toString());

        Gson gson = new Gson();
        StationResponse response = gson.fromJson(sb.toString(), StationResponse.class);
        List<Station> items = response.getItems().getItem();

        // 아이템이 stationID와 chgerID가 제대로 설정되었는지 확인
        /*for (Station item : items) {
            if (item.getStatId() == null || item.getChgerId() == null) {
                System.out.println("Null ID found for item: " + item);
            }
        }*/
        for (Station item : items) {
            Station existingItem = chargerInfoItemRepository.findByStatId(item.getStatId());
            
            if (existingItem == null || !existingItem.getStatUpdDt().equals(item.getStatUpdDt())) {
                chargerInfoItemRepository.save(item);
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
