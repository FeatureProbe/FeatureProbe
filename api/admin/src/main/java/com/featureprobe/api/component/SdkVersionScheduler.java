package com.featureprobe.api.component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.ConnectionPool;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.apache.commons.lang3.StringUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;


@Slf4j
@Component
public class SdkVersionScheduler {

    private static final String JAVA_SDK_VERSION = "java_sdk_version";
    private static final String RUST_SDK_VERSION = "rust_sdk_version";
    private static final String ANDROID_SDK_VERSION = "android_sdk_version";

    public static final Map<String, String> latestVersions = new HashMap<>(3);

    private static final OkHttpClient httpClient =
            new OkHttpClient.Builder().connectionPool(new ConnectionPool()).callTimeout(10, TimeUnit.SECONDS)
                    .retryOnConnectionFailure(true).build();

    private static final ObjectMapper mapper = new ObjectMapper();

    @Scheduled(cron = "0 0 0 * * ?")  // every day at 0:00
    @PostConstruct
    public void fetchLatestJavaSdkVersion() {
        String latestVersion = getSdkVersionFromSearchMavenOrg("server-sdk-java");
        if (StringUtils.isBlank(latestVersion)) {
            latestVersion = getSdkVersionFromDeveloperAliyunCom("server-sdk-java");
        }
        latestVersions.put(JAVA_SDK_VERSION, latestVersion);
    }

    @Scheduled(cron = "0 1 0 * * ?")  // every day at 0:01
    @PostConstruct
    public void fetchLatestAndroidSdkVersion() {
        String latestVersion = getSdkVersionFromSearchMavenOrg("client-sdk-android");
        if (StringUtils.isBlank(latestVersion)) {
            latestVersion = getSdkVersionFromDeveloperAliyunCom("client-sdk-android");
        }
        latestVersions.put(ANDROID_SDK_VERSION, latestVersion);
    }

    @Scheduled(cron = "0 2 0 * * ?")  // every day at 0:02
    @PostConstruct
    public void fetchLatestRustSdkVersion() {
        String latestVersion = getRustSdkVersionFromCratesIo();
        latestVersions.put(RUST_SDK_VERSION, latestVersion);
    }

    private String getRustSdkVersionFromCratesIo() {
        Request request =
                new Request.Builder()
                        .url("https://crates.io/api/v1/crates/feature-probe-server-sdk")
                        .get()
                        .build();

        String latestVersion = null;
        try (Response resp = httpClient.newCall(request).execute()) {
            JsonNode respRoot = mapper.readTree(Objects.requireNonNull(resp.body()).byteStream());
            latestVersion = respRoot
                    .path("crate")
                    .path("max_stable_version")
                    .asText();
            log.info("Query version info of 'server-sdk-rust' from 'crates.io': latest version {}", latestVersion);
        } catch (Exception e) {
            log.warn("Fail to fetch latest sdk version from 'crates.io'", e);
        }
        return latestVersion;
    }


    private String getSdkVersionFromSearchMavenOrg(String artifact) {
        Request request = new Request.Builder()
                .url("https://search.maven.org/solrsearch/select?q=com.featureprobe." + artifact)
                .get()
                .build();

        String latestVersion = null;
        try (Response resp = httpClient.newCall(request).execute()) {
            JsonNode respRoot = mapper.readTree(Objects.requireNonNull(resp.body()).byteStream());
            latestVersion = respRoot
                    .path("response")
                    .path("docs")
                    .path(0)
                    .path("latestVersion")
                    .asText();
            log.info("Query version info of '{}' from 'search.maven.org': latest version {}", artifact, latestVersion);
        } catch (Exception e) {
            log.warn("Fail to fetch latest sdk version from 'search.maven.org'", e);
        }
        return latestVersion;
    }

    private String getSdkVersionFromDeveloperAliyunCom(String artifact) {
        Request request = new Request.Builder()
                .url("https://developer.aliyun.com/artifact/aliyunMaven/searchArtifactByGav" +
                        "?groupId=com.featureprobe&version=&repoId=central&artifactId=" + artifact)
                .get()
                .build();

        String latestVersion = null;
        try (Response resp = httpClient.newCall(request).execute()) {
            JsonNode respRoot = mapper.readTree(Objects.requireNonNull(resp.body()).byteStream());
            latestVersion = respRoot
                    .path("object")
                    .path(0)
                    .path("version")
                    .asText();
            log.info("Query version info of '{}' from 'developer.aliyun.com': latest version {}", artifact,
                    latestVersion);
        } catch (Exception e) {
            log.warn("Fail to fetch latest sdk version from 'developer.aliyun.com'", e);
        }
        return latestVersion;
    }

}
