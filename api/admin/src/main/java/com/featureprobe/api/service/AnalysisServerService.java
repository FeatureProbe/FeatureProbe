package com.featureprobe.api.service;

import com.featureprobe.api.config.AppConfig;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.ConnectionPool;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@AllArgsConstructor
public class AnalysisServerService {

    AppConfig appConfig;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectionPool(new ConnectionPool(5, 5, TimeUnit.SECONDS))
            .connectTimeout(Duration.ofSeconds(3))
            .readTimeout(Duration.ofSeconds(3))
            .writeTimeout(Duration.ofSeconds(3))
            .retryOnConnectionFailure(true)
            .build();

    public String callAnalysisServer(String path, String query, String sdkKey) {
        String res = "{}";
        try {
            String url = appConfig.getAnalysisBaseUrl() + path + "?" + query;
            Request request = new Request.Builder()
                    .header("Authorization", sdkKey)
                    .url(url)
                    .get()
                    .build();
            Response response = httpClient.newCall(request).execute();
            if (response.isSuccessful()) {
                res = response.body().string();
            }
            log.info("Request analysis server, url: {}, sdkKey: {}, response: {}", url, sdkKey, response);
        } catch (IOException e) {
            log.error("Call Analysis Server Error: {}", e);
            throw new RuntimeException(e);
        }
        return res;
    }

    public String formatHttpQuery(Map<String, Object> paramMap) {
        String param = "";
        for (String key : paramMap.keySet()) {
            if (Objects.nonNull(paramMap.get(key))) {
                param += key + "=" + paramMap.get(key) + "&";
            }
        }
        return param;
    }
}
