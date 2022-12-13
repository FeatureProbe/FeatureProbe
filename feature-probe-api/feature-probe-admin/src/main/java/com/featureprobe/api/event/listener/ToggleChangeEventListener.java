package com.featureprobe.api.event.listener;

import com.featureprobe.api.config.AppConfig;
import com.featureprobe.api.event.ToggleChangeEvent;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.ConnectionPool;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@AllArgsConstructor
public class ToggleChangeEventListener implements ApplicationListener<ToggleChangeEvent> {

    private AppConfig appConfig;

    private static final String CHANGE_API_PATH = "/api/change";

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectionPool( new ConnectionPool(5, 5, TimeUnit.SECONDS))
            .connectTimeout(Duration.ofSeconds(3))
            .readTimeout(Duration.ofSeconds(3))
            .writeTimeout(Duration.ofSeconds(3))
            .retryOnConnectionFailure(true)
            .build();


    @Override
    public void onApplicationEvent(ToggleChangeEvent event) {
        String[] serverBaseUrls = appConfig.getServerBaseUrls();
        if (Objects.nonNull(serverBaseUrls) && serverBaseUrls.length > 0) {
            for(String serverUrl : serverBaseUrls) {
                pushChange(serverUrl + CHANGE_API_PATH + "?sdk_key=" + event.getServerSdkKey());
            }
        }
    }

    public boolean pushChange(String serverUrl) {
        try {
            RequestBody body = RequestBody.create(MediaType.parse("application/json"), "");
            Request request = new Request.Builder()
                    .url(serverUrl)
                    .put(body)
                    .build();
            Response response = httpClient.newCall(request).execute();
            log.info("--------{}", response);
            return response.isSuccessful();
        } catch (IOException e) {
            log.error("Toggle change server notice error", e);
            return false;
        }
    }

}
