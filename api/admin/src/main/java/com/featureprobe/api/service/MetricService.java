package com.featureprobe.api.service;

import com.featureprobe.api.base.enums.ChangeLogType;
import com.featureprobe.api.base.enums.EventTypeEnum;
import com.featureprobe.api.base.enums.MatcherTypeEnum;
import com.featureprobe.api.base.enums.MetricTypeEnum;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.base.enums.WinCriteria;
import com.featureprobe.api.base.util.JsonMapper;
import com.featureprobe.api.base.util.RegexValidator;
import com.featureprobe.api.config.AppConfig;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.Event;
import com.featureprobe.api.dao.entity.Metric;
import com.featureprobe.api.dao.entity.MetricIteration;
import com.featureprobe.api.dao.entity.TargetingVersion;
import com.featureprobe.api.dao.entity.ToggleControlConf;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.dao.repository.EventRepository;
import com.featureprobe.api.dao.repository.MetricIterationRepository;
import com.featureprobe.api.dao.repository.MetricRepository;
import com.featureprobe.api.dao.repository.TargetingVersionRepository;
import com.featureprobe.api.dao.repository.ToggleControlConfRepository;
import com.featureprobe.api.dto.AnalysisRequest;
import com.featureprobe.api.dto.AnalysisResultResponse;
import com.featureprobe.api.dto.MetricConfigResponse;
import com.featureprobe.api.dto.MetricCreateRequest;
import com.featureprobe.api.dto.MetricIterationResponse;
import com.featureprobe.api.dto.MetricResponse;
import com.featureprobe.api.mapper.MetricIterationMapper;
import com.featureprobe.api.mapper.MetricMapper;
import com.featureprobe.api.mapper.TargetingVersionMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.ConnectionPool;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.codehaus.plexus.util.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.TreeSet;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@AllArgsConstructor
@Service
public class MetricService {
    private EventRepository eventRepository;

    private MetricRepository metricRepository;

    private ToggleControlConfRepository toggleControlConfRepository;
    private EnvironmentRepository environmentRepository;

    private MetricIterationRepository metricIterationRepository;

    private TargetingVersionRepository targetingVersionRepository;
    private ChangeLogService changeLogService;

    private AppConfig appConfig;

    @PersistenceContext
    public EntityManager entityManager;

    private static String ALGORITHM_BINOMIAL = "binomial";

    private static String ALGORITHM_GAUSSIAN = "gaussian";

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectionPool(new ConnectionPool(5, 5, TimeUnit.SECONDS))
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
                .orElse(new Metric(request.getMetricType(), projectKey, environmentKey, toggleKey, new TreeSet<>()));
        MetricMapper.INSTANCE.mapEntity(request, metric);
        if (EventTypeEnum.CLICK.equals(request.getEventType())) {
            String clickUniqueName = generateClickUniqueName(request.getMatcher(), request.getUrl(),
                    request.getSelector());
            Event clickEvent = eventRepository.findByName(clickUniqueName)
                    .orElse(new Event(EventTypeEnum.CLICK, clickUniqueName, request.getMatcher(), request.getUrl(),
                            request.getSelector()));
            metric.getEvents().add(eventRepository.save(clickEvent));
        }
        if (EventTypeEnum.PAGE_VIEW.equals(request.getEventType())
                || EventTypeEnum.CLICK.equals(request.getEventType())) {
            String pvUniqueName = generatePVUniqueName(request.getMatcher(), request.getUrl());
            Event pvEvent = eventRepository.findByName(pvUniqueName).
                    orElse(new Event(EventTypeEnum.PAGE_VIEW, pvUniqueName, request.getMatcher(), request.getUrl()));
            metric.getEvents().add(eventRepository.save(pvEvent));
        } else {
            Event customEvent = eventRepository.findByName(request.getEventName()).
                    orElse(new Event(EventTypeEnum.CUSTOM, request.getEventName(), request.getMatcher(),
                            request.getUrl()));
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

    public AnalysisResultResponse analysis(String projectKey, String environmentKey, String toggleKey,
                                           AnalysisRequest params) {
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
        if (Objects.nonNull(params.getStart()) && Objects.nonNull(params.getEnd())) {
            start = params.getStart();
            end = params.getEnd();
        }
        String type = ALGORITHM_BINOMIAL;
        String name = getMetricName(metric);
        String aggregationMethod = AggregationMethod.AVG.name();
        String joinType = JoinType.LEFT.name();
        boolean positiveWin = true;
        if (!MetricTypeEnum.CONVERSION.equals(metric.getType())) {
            type = ALGORITHM_GAUSSIAN;
            positiveWin = WinCriteria.POSITIVE.equals(metric.getWinCriteria()) ? true : false;
        }
        if (MetricTypeEnum.SUM.equals(metric.getType())) {
            aggregationMethod = AggregationMethod.SUM.name();
        } if (MetricTypeEnum.COUNT.equals(metric.getType())) {
            aggregationMethod = AggregationMethod.COUNT.name();
        }
        if (MetricTypeEnum.AVERAGE.equals(metric.getType())) {
            joinType = JoinType.INNER.name();
        }
        String callRes = callAnalysis(querySdkServerKey(projectKey, environmentKey), name, toggleKey, type,
                aggregationMethod, joinType, positiveWin, start, end);
        return new AnalysisResultResponse(start, end, MetricMapper.INSTANCE.entityToConfigResponse(metric),
                JsonMapper.toObject(callRes, Map.class).get("data"));
    }

    public List<MetricIterationResponse> iteration(String projectKey, String environmentKey, String toggleKey) {
        List<MetricIteration> iterations = metricIterationRepository
                .findAllByProjectKeyAndEnvironmentKeyAndToggleKeyOrderByStartAsc(projectKey, environmentKey,
                        toggleKey);
        List<MetricIterationResponse> responses = iterations.stream()
                .map(iteration -> MetricIterationMapper.INSTANCE.entityToResponse(iteration))
                .collect(Collectors.toList());
        if (CollectionUtils.isNotEmpty(responses)) {
            Date time = responses.get(0).getStart();
            List<TargetingVersion> versions = targetingVersionRepository
                    .findAllByProjectKeyAndEnvironmentKeyAndToggleKeyAndCreatedTimeGreaterThanEqualOrderByVersionDesc(
                            projectKey, environmentKey, toggleKey, time);
            responses.forEach(response -> {
                List<MetricIterationResponse.PublishRecord> records;
                if (Objects.isNull(response.getStop())) {
                    records = versions.stream()
                            .filter(version -> version.getCreatedTime().after(response.getStart()))
                            .map(version -> TargetingVersionMapper.INSTANCE.entityToPublishRecord(version))
                            .collect(Collectors.toList());
                } else {
                    records = versions.stream()
                            .filter(version -> version.getCreatedTime().after(response.getStart())
                                    && version.getCreatedTime().before(response.getStop()))
                            .map(version -> TargetingVersionMapper.INSTANCE.entityToPublishRecord(version))
                            .collect(Collectors.toList());
                }
                response.setRecords(records);
            });
        }
        return responses;
    }

    public MetricIteration updateMetricIteration(String projectKey, String environmentKey, String toggleKey,
                                                 boolean trackAccessEvents, Date now) {
        MetricIteration iteration;
        if (trackAccessEvents) {
            iteration = metricIterationRepository.save(buildMetricIteration(projectKey, environmentKey, toggleKey,
                    now, null));
        } else {
            List<MetricIteration> iterations = metricIterationRepository
                    .findAllByProjectKeyAndEnvironmentKeyAndToggleKeyOrderByStartAsc(projectKey, environmentKey,
                            toggleKey);
            MetricIteration latestIteration = iterations.get(iterations.size() - 1);
            latestIteration.setStop(now);
            return metricIterationRepository.save(latestIteration);
        }
        return iteration;
    }

    private MetricIteration buildMetricIteration(String projectKey, String environmentKey, String toggleKey,
                                                 Date start, Date stop) {
        MetricIteration iteration = new MetricIteration();
        iteration.setProjectKey(projectKey);
        iteration.setEnvironmentKey(environmentKey);
        iteration.setToggleKey(toggleKey);
        iteration.setStart(start);
        iteration.setStop(stop);
        return iteration;
    }

    private String querySdkServerKey(String projectKey, String environmentKey) {
        Environment environment = environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey)
                .orElseThrow(() ->
                        new ResourceNotFoundException(ResourceType.ENVIRONMENT, projectKey + "-" + environmentKey));
        return environment.getServerSdkKey();
    }

    private static String getMetricName(Metric metric) {
        String name ;
        if (MetricTypeEnum.CONVERSION.equals(metric.getType())) {
            name = metric.getEvents().stream().filter(event -> StringUtils.isBlank(event.getSelector()))
                    .findFirst().get().getName();
        } else {
            name = metric.getEvents().stream().findFirst().get().getName();
        }
        return name;
    }

    public static String generatePVUniqueName(MatcherTypeEnum matcher, String url) {
        String encodeStr = matcher.name() + url;
        return DigestUtils.md2Hex(encodeStr.getBytes(StandardCharsets.UTF_8));
    }

    private String callAnalysis(String sdkKey,
                                      String metric,
                                      String toggleKey,
                                      String type,
                                      String numeratorFn,
                                      String join,
                                      boolean positiveWin,
                                      Date start,
                                      Date end) {

        String query = "metric=" + metric +
                "&toggle=" + toggleKey + "&type=" + type + "&positiveWin=" + positiveWin +
                "&numeratorFn=" + numeratorFn + "&join=" + join +
                "&start=" + start.getTime() + "&end=" + end.getTime();
        return this.callAnalysisServer("/analysis", query, sdkKey);
    }

    private String callAnalysisServer(String path, String query, String sdkKey) {
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


    private static String generateClickUniqueName(MatcherTypeEnum matcher, String url, String selector) {
        String encodeStr = matcher.name() + url + selector;
        return DigestUtils.md2Hex(encodeStr.getBytes(StandardCharsets.UTF_8));
    }

    private void validate(MetricCreateRequest request) {

        if (!(EventTypeEnum.PAGE_VIEW.equals(request.getEventType())
                || EventTypeEnum.CLICK.equals(request.getEventType()))
                && StringUtils.isBlank(request.getEventName())) {
            throw new IllegalArgumentException("validate.event_name_required");
        }

        if ((EventTypeEnum.PAGE_VIEW.equals(request.getEventType())
                || EventTypeEnum.CLICK.equals(request.getEventType()))
                && (request.getMatcher() == null || StringUtils.isBlank(request.getUrl()))) {
            throw new IllegalArgumentException("validate.event_url_required");
        }

        if (EventTypeEnum.CLICK.equals(request.getEventType()) && StringUtils.isBlank(request.getSelector())) {
            throw new IllegalArgumentException("validate.event_selector_required");
        }

        if (!MetricTypeEnum.CONVERSION.equals(request.getMetricType()) && Objects.isNull(request.getWinCriteria())) {
            throw new IllegalArgumentException("validate.metric_win_criteria_required");
        }

        if ((EventTypeEnum.PAGE_VIEW.equals(request.getEventType())
                || EventTypeEnum.CLICK.equals(request.getEventType()))
                && (MatcherTypeEnum.REGULAR.equals(request.getMatcher()) &&
                        !RegexValidator.validateRegex(request.getUrl()))) {
            throw new IllegalArgumentException("validate.regex_invalid");
        }

    }

    public boolean existsMetric(String projectKey, String environmentKey, String toggleKey) {
        return metricRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey).isPresent();
    }

    public boolean isReport(String projectKey, String environmentKey, String toggleKey) {
        String sdkServerKey = querySdkServerKey(projectKey, environmentKey);
        Optional<Metric> metric = metricRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey);
        if (!metric.isPresent()) {
            return false;
        }
        String metricName = metric.get().getName();
        String query = "metric=" + metricName;
        String response = callAnalysisServer("/exists_event", query, sdkServerKey);

        return BooleanUtils.toBoolean(String.valueOf(JsonMapper.toObject(response, Map.class).get("exists")));
    }

    public enum AggregationMethod {
        AVG, SUM, COUNT
    }

    public enum  JoinType {
        INNER, LEFT
    }

}
