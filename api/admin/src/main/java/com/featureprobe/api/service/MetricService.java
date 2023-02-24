package com.featureprobe.api.service;

import com.featureprobe.api.base.enums.ChangeLogType;
import com.featureprobe.api.base.enums.MatcherTypeEnum;
import com.featureprobe.api.base.enums.MetricTypeEnum;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.base.enums.WinCriteria;
import com.featureprobe.api.base.util.JsonMapper;
import com.featureprobe.api.config.AppConfig;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.Event;
import com.featureprobe.api.dao.entity.Metric;
import com.featureprobe.api.dao.entity.ToggleControlConf;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.dao.repository.EventRepository;
import com.featureprobe.api.dao.repository.MetricRepository;
import com.featureprobe.api.dao.repository.ToggleControlConfRepository;
import com.featureprobe.api.dto.AnalysisResultResponse;
import com.featureprobe.api.dto.MetricConfigResponse;
import com.featureprobe.api.dto.MetricCreateRequest;
import com.featureprobe.api.dto.MetricResponse;
import com.featureprobe.api.mapper.MetricMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.ConnectionPool;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.RegExUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.codehaus.plexus.util.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.TreeSet;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

@Slf4j
@AllArgsConstructor
@Service
public class MetricService {
    private EventRepository eventRepository;

    private MetricRepository metricRepository;

    private ToggleControlConfRepository toggleControlConfRepository;
    private EnvironmentRepository environmentRepository;
    private ChangeLogService changeLogService;

    private AppConfig appConfig;

    @PersistenceContext
    public EntityManager entityManager;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectionPool( new ConnectionPool(5, 5, TimeUnit.SECONDS))
            .connectTimeout(Duration.ofSeconds(3))
            .readTimeout(Duration.ofSeconds(3))
            .writeTimeout(Duration.ofSeconds(3))
            .retryOnConnectionFailure(true)
            .build();

    @Transactional(rollbackFor = Exception.class)
    public MetricResponse create(String projectKey, String environmentKey, String toggleKey,
                                 MetricCreateRequest request) {
        validate(request);
        Metric metric = metricRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey)
                .orElse(new Metric(request.getType(), projectKey, environmentKey, toggleKey, new TreeSet<>()));
        MetricMapper.INSTANCE.mapEntity(request, metric);
        if (MetricTypeEnum.CLICK.equals(request.getType())) {
            String clickUniqueName = generateClickUniqueName(request.getMatcher(), request.getUrl(),
                    request.getSelector());
            Event clickEvent = eventRepository.findByName(clickUniqueName)
                    .orElse(new Event(clickUniqueName, request.getMatcher(), request.getUrl(), request.getSelector()));
            metric.getEvents().add(eventRepository.save(clickEvent));
        }
        if (MetricTypeEnum.PAGE_VIEW.equals(request.getType()) || MetricTypeEnum.CLICK.equals(request.getType())) {
            String pvUniqueName = generatePVUniqueName(request.getMatcher(), request.getUrl());
            Event pvEvent = eventRepository.findByName(pvUniqueName).
                    orElse(new Event(pvUniqueName, request.getMatcher(), request.getUrl()));
            metric.getEvents().add(eventRepository.save(pvEvent));
        } else {
            Event customEvent = eventRepository.findByName(request.getEventName()).
                    orElse(new Event(request.getEventName(), request.getMatcher(), request.getUrl()));
            metric.getEvents().add(eventRepository.save(customEvent));
        }
        Environment environment = environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey)
                .orElseThrow(() ->
                        new ResourceNotFoundException(ResourceType.ENVIRONMENT, projectKey + "-" + environmentKey));
        changeLogService.create(environment, ChangeLogType.CHANGE);
        Metric savedMetric = metricRepository.save(metric);
        return MetricMapper.INSTANCE.entityToResponse(savedMetric);
    }

    public MetricConfigResponse query(String projectKey, String environmentKey, String toggleKey) {
        Metric metric = metricRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.METRIC, projectKey + "-"
                        + environmentKey + "-" + toggleKey));
        return MetricMapper.INSTANCE.entityToConfigResponse(metric);
    }

    public AnalysisResultResponse analysis(String projectKey, String environmentKey, String toggleKey) {
        Environment environment = environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey)
                .orElseThrow(() ->
                        new ResourceNotFoundException(ResourceType.ENVIRONMENT, projectKey + "-" + environmentKey));
        Metric metric = metricRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.METRIC, projectKey + "-"
                        + environmentKey + "-" + toggleKey));
        ToggleControlConf toggleControlConf = toggleControlConfRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.TOGGLE_CONTROL_CONF,
                        projectKey + "-" + environmentKey + "-" + toggleKey));
        Date start = toggleControlConf.getTrackStartTime();
        Date end = toggleControlConf.getTrackEndTime();
        if (Objects.isNull(end)) {
            end = new Date();
        }
        String name ;
        if (MetricTypeEnum.CLICK.equals(metric.getType())) {
            name = metric.getEvents().stream().filter(event -> StringUtils.isBlank(event.getSelector()))
                    .findFirst().get().getName();
        } else {
            name = metric.getEvents().stream().findFirst().get().getName();
        }
        String type = "binomial";
        boolean positiveWin = true;
        if (MetricTypeEnum.NUMERIC.equals(metric.getType())) {
            type = "gaussian";
            positiveWin = WinCriteria.POSITIVE.equals(metric.getWinCriteria()) ? true : false;
        }

        String callRes = callAnalysisServer(environment.getServerSdkKey(), name, toggleKey, type,
                positiveWin, start, end);
        return new AnalysisResultResponse(start, end, MetricMapper.INSTANCE.entityToConfigResponse(metric),
                JsonMapper.toObject(callRes, Map.class).get("data"));
    }

    public static String generatePVUniqueName(MatcherTypeEnum matcher, String url) {
        String encodeStr = matcher.name() + url;
        return DigestUtils.md2Hex(encodeStr.getBytes(StandardCharsets.UTF_8));
    }

    private String callAnalysisServer(String sdkKey,
                                      String metric,
                                      String toggleKey,
                                      String type,
                                      boolean positiveWin,
                                      Date start,
                                      Date end) {
        String res = "{}";
        try {
            String url = appConfig.getAnalysisUrl() + "?metric=" + metric +
                    "&toggle=" + toggleKey + "&type=" + type + "&positiveWin=" + positiveWin +
                    "&start="+ start.getTime() + "&end=" + end.getTime();
            Request request = new Request.Builder()
                    .header("Authorization", sdkKey)
                    .url(url)
                    .get()
                    .build();
            Response response =  httpClient.newCall(request).execute();
            if (response.isSuccessful()) {
                res = response.body().string();
            }
        } catch (IOException e) {
            log.error("Call Analysis Server Error: {}", e);
            throw new RuntimeException(e);
        }
        return res;
    }

    private static String generateClickUniqueName(MatcherTypeEnum matcher, String url, String selector) {
        String encodeStr = matcher.name() + url + selector;
        return DigestUtils.md2Hex(encodeStr.getBytes(StandardCharsets.UTF_8));
    }


    private void validate(MetricCreateRequest request) {

        if (!(MetricTypeEnum.PAGE_VIEW.equals(request.getType()) || MetricTypeEnum.CLICK.equals(request.getType()))
                && StringUtils.isBlank(request.getEventName())) {
            throw new IllegalArgumentException("validate.event_name_required");
        }

        if ((MetricTypeEnum.PAGE_VIEW.equals(request.getType()) || MetricTypeEnum.CLICK.equals(request.getType()))
                && (request.getMatcher() == null || StringUtils.isBlank(request.getUrl()))) {
            throw new IllegalArgumentException("validate.event_url_required");
        }

        if (MetricTypeEnum.CLICK.equals(request.getType()) && StringUtils.isBlank(request.getSelector())) {
            throw new IllegalArgumentException("validate.event_selector_required");
        }

        if (MetricTypeEnum.NUMERIC.equals(request.getType()) && Objects.isNull(request.getWinCriteria())) {
            throw new IllegalArgumentException("validate.metric_win_criteria_required");
        }
    }

    public boolean existsMetric(String projectKey, String environmentKey, String toggleKey) {
        return metricRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey).isPresent();
    }

}
