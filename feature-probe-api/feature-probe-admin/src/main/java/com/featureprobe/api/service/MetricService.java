package com.featureprobe.api.service;

import com.featureprobe.api.base.model.TargetingContent;
import com.featureprobe.api.base.model.Variation;
import com.featureprobe.api.dto.AccessEventPoint;
import com.featureprobe.api.dto.AccessStatusResponse;
import com.featureprobe.api.dto.MetricResponse;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.Event;
import com.featureprobe.api.dao.entity.MetricsCache;
import com.featureprobe.api.dao.entity.Targeting;
import com.featureprobe.api.dao.entity.TargetingVersion;
import com.featureprobe.api.dao.entity.VariationHistory;
import com.featureprobe.api.base.enums.MetricType;
import com.featureprobe.api.base.enums.MetricsCacheTypeEnum;
import com.featureprobe.api.dto.VariationAccessCounter;
import com.featureprobe.api.mapper.TargetingVersionMapper;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.dao.repository.EventRepository;
import com.featureprobe.api.dao.repository.MetricsCacheRepository;
import com.featureprobe.api.dao.repository.TargetingRepository;
import com.featureprobe.api.dao.repository.TargetingVersionRepository;
import com.featureprobe.api.dao.repository.VariationHistoryRepository;
import com.featureprobe.api.base.tenant.TenantContext;
import com.featureprobe.api.base.util.JsonMapper;
import com.google.common.collect.Lists;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class MetricService {

    private static final ExecutorService taskExecutor = new ThreadPoolExecutor(3, 50,
            30, TimeUnit.SECONDS, new ArrayBlockingQueue<>(1000));

    private EnvironmentRepository environmentRepository;
    private EventRepository eventRepository;
    private VariationHistoryRepository variationHistoryRepository;
    private TargetingVersionRepository targetingVersionRepository;
    private TargetingRepository targetingRepository;
    private MetricsCacheRepository metricsCacheRepository;

    @PersistenceContext
    public EntityManager entityManager;

    private static final int MAX_QUERY_HOURS = 12 * 24;
    private static final int MAX_QUERY_POINT_COUNT = 12;
    private static final int GROUP_BY_DAY_HOURS = 24;

    public AccessStatusResponse isAccess(String projectKey, String environmentKey, String toggleKey) {
        String serverSdkKey = queryEnvironmentServerSdkKey(projectKey, environmentKey);
        boolean isAccess = eventRepository.existsBySdkKeyAndToggleKey(serverSdkKey, toggleKey);
        return new AccessStatusResponse(isAccess);
    }

    public MetricResponse query(String projectKey, String environmentKey, String toggleKey, MetricType metricType,
                                int lastHours) {
        int queryLastHours = Math.min(lastHours, MAX_QUERY_HOURS);
        String serverSdkKey = queryEnvironmentServerSdkKey(projectKey, environmentKey);
        Targeting targeting = targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey,
                environmentKey, toggleKey).get();
        Map<String, VariationHistory> variationVersionMap = buildVariationVersionMap(projectKey,
                environmentKey, toggleKey);
        List<AccessEventPoint> accessEventPoints = queryAccessEventPoints(serverSdkKey, toggleKey, targeting,
                queryLastHours);
        List<AccessEventPoint> aggregatedAccessEventPoints = aggregatePointByMetricType(variationVersionMap,
                accessEventPoints, metricType);
        List<VariationAccessCounter> accessCounters = summaryAccessEvents(aggregatedAccessEventPoints);
        appendLatestVariations(accessCounters, targeting, metricType);
        boolean isAccess = eventRepository.existsBySdkKeyAndToggleKey(serverSdkKey, toggleKey);
        return new MetricResponse(isAccess, accessEventPoints, sortAccessCounters(accessCounters));
    }

    private Map<String, VariationHistory> buildVariationVersionMap(String projectKey, String environmentKey,
                                                                   String toggleKey) {
        List<VariationHistory> variationHistories
                = variationHistoryRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey,
                environmentKey, toggleKey);

        return variationHistories.stream().collect(Collectors.toMap(this::toIndexValue, Function.identity()));
    }

    protected List<AccessEventPoint> aggregatePointByMetricType(Map<String, VariationHistory> variationVersionMap,
                                                                List<AccessEventPoint> accessEventPoints,
                                                                MetricType metricType) {

        accessEventPoints.forEach(accessEventPoint -> {
            List<VariationAccessCounter> variationAccessCounters = accessEventPoint.getValues();

            List<VariationAccessCounter> filteredVariationAccessCounters = variationAccessCounters.stream()
                    .filter(variationAccessCounter ->
                            Objects.nonNull(variationVersionMap.get(variationAccessCounter.getValue())))
                    .collect(Collectors.toList());
            filteredVariationAccessCounters.stream().forEach(variationAccessCounter -> {
                VariationHistory variationHistory = variationVersionMap.get(variationAccessCounter.getValue());
                variationAccessCounter.setValue(metricType.isNameType() ? variationHistory.getName() :
                        variationHistory.getValue());
            });
            accessEventPoint.setValues(filteredVariationAccessCounters);
            Map<String, Long> variationCounts =
                    accessEventPoint.getValues().stream().collect(Collectors.toMap(VariationAccessCounter::getValue,
                            VariationAccessCounter::getCount, Long::sum));

            List<VariationAccessCounter> values = variationCounts.entrySet().stream().map(e ->
                            new VariationAccessCounter(e.getKey(), e.getValue()))
                    .collect(Collectors.toList());
            accessEventPoint.setValues(values);
        });
        return accessEventPoints;
    }

    private List<AccessEventPoint> queryAccessEventPoints(String serverSdkKey, String toggleKey, Targeting targeting,
                                                          int lastHours) {
        int pointIntervalCount = getPointIntervalCount(lastHours);
        int pointCount = lastHours / pointIntervalCount;

        LocalDateTime pointStartTime = getQueryStartDateTime(lastHours);
        String pointNameFormat = getPointNameFormat(lastHours);

        List<AccessEventPoint> accessEventPoints = Collections.synchronizedList(new ArrayList<>());
        CountDownLatch counter = new CountDownLatch(pointCount);
        for (int i = 1; i <= pointCount; i++) {
            boolean cacheFlag = i != pointCount;
            LocalDateTime pointEndTime = pointStartTime.plusHours(pointIntervalCount);
            QueryAccessEventPointTask task = new QueryAccessEventPointTask(serverSdkKey, toggleKey, cacheFlag,
                    targeting, pointNameFormat, pointStartTime, pointEndTime, accessEventPoints, counter, i,
                    Long.parseLong(TenantContext.getCurrentTenant()));
            taskExecutor.submit(task);
            pointStartTime = pointEndTime;
        }
        try {
            counter.await(30, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            log.error("System error", e);
        }
        return accessEventPoints.stream().
                sorted(Comparator.comparing(AccessEventPoint::getSorted)).collect(Collectors.toList());
    }

    protected int getPointIntervalCount(int lastHours) {
        int pointIntervalCount;
        if (isGroupByDay(lastHours)) {
            pointIntervalCount = GROUP_BY_DAY_HOURS;
        } else {
            pointIntervalCount = lastHours <= MAX_QUERY_POINT_COUNT ? 1 : 2;
        }
        return pointIntervalCount;
    }

    private Long queryLastTargetingVersion(Targeting targeting, LocalDateTime pointStartTime,
                                           LocalDateTime pointEndTime, Long tenantId) {
        Specification<TargetingVersion> spec = buildVersionQuerySpec(targeting, pointStartTime, pointEndTime, tenantId);
        List<TargetingVersion> targetingVersions = targetingVersionRepository.findAll(spec);
        if (CollectionUtils.isNotEmpty(targetingVersions)) {
            return targetingVersions.get(0).getVersion();
        }
        return null;
    }

    private Specification<TargetingVersion> buildVersionQuerySpec(Targeting targeting, LocalDateTime pointStartTime,
                                                                  LocalDateTime pointEndTime, Long tenantId) {
        return (root, query, cb) -> {
            Predicate p0 = cb.equal(root.get("projectKey"), targeting.getProjectKey());
            Predicate p1 = cb.equal(root.get("environmentKey"), targeting.getEnvironmentKey());
            Predicate p2 = cb.equal(root.get("toggleKey"), targeting.getToggleKey());
            Predicate p3 = cb.equal(root.get("organizationId"), tenantId);
            Predicate p4 = cb.greaterThanOrEqualTo(root.get("createdTime"), toDate(pointStartTime));
            Predicate p5 = cb.lessThanOrEqualTo(root.get("createdTime"), toDate(pointEndTime));
            query.where(cb.and(p0, p1, p2, p3, p4, p5)).orderBy(cb.desc(root.get("version")));
            return query.getRestriction();
        };
    }

    private void saveMetricsCache(String serverSdkKey, String toggleKey, Date startDate,
                                  Date endDate, List<VariationAccessCounter> variationAccessCounters) {
        MetricsCache cache = new MetricsCache();
        cache.setSdkKey(serverSdkKey);
        cache.setToggleKey(toggleKey);
        cache.setStartDate(startDate);
        cache.setEndDate(endDate);
        cache.setData(JsonMapper.toJSONString(variationAccessCounters));
        cache.setType(MetricsCacheTypeEnum.METRICS);
        metricsCacheRepository.save(cache);
    }

    private List<VariationAccessCounter> queryMetricsCache(String serverSdkKey, String toggleKey, Date startDate,
                                                           Date endDate) {
        Optional<MetricsCache> metricsCache =
                metricsCacheRepository.findBySdkKeyAndToggleKeyAndStartDateAndEndDateAndType(serverSdkKey, toggleKey,
                        startDate, endDate, MetricsCacheTypeEnum.METRICS);
        if (metricsCache.isPresent()) {
            return JsonMapper.toListObject(metricsCache.get().getData(), VariationAccessCounter.class);
        } else {
            return null;
        }
    }

    protected List<VariationAccessCounter> toAccessEvent(List<Event> events) {
        if (CollectionUtils.isEmpty(events)) {
            return Collections.emptyList();
        }
        Map<String, Long> variationCounts =
                events.stream().collect(Collectors.toMap(this::toIndexValue, Event::getCount, Long::sum));
        return variationCounts.entrySet().stream().map(e ->
                new VariationAccessCounter(e.getKey(), e.getValue())).collect(Collectors.toList());
    }

    private String toIndexValue(Event event) {
        return event.getToggleVersion() + "_" + event.getValueIndex();
    }

    private String toIndexValue(VariationHistory variationHistory) {
        return variationHistory.getToggleVersion() + "_" + variationHistory.getValueIndex();
    }

    protected String getPointNameFormat(int lastHours) {
        return isGroupByDay(lastHours) ? "MM/dd" : "HH";
    }

    protected LocalDateTime getQueryStartDateTime(LocalDateTime nowDateTime, int queryLastHours) {
        if (isGroupByDay(queryLastHours)) {
            nowDateTime = nowDateTime.withHour(23).withMinute(59).withSecond(59).withNano(0);
        } else {
            nowDateTime = nowDateTime.withMinute(0).withSecond(0).withNano(0).plusHours(1);
        }
        return nowDateTime.minusHours(queryLastHours);
    }

    private LocalDateTime getQueryStartDateTime(int queryLastHours) {
        return getQueryStartDateTime(LocalDateTime.now(), queryLastHours);
    }

    protected List<VariationAccessCounter> summaryAccessEvents(List<AccessEventPoint> accessEventPoints) {

        List<VariationAccessCounter> summaryEvents = Lists.newArrayList();
        accessEventPoints.forEach(accessEventPoint -> {
            Map<String, Long> variationCount = accessEventPoint.getValues().stream().collect(
                    Collectors.toMap(VariationAccessCounter::getValue, VariationAccessCounter::getCount));
            variationCount.keySet().forEach(key -> {
                VariationAccessCounter findingToggleCounter = summaryEvents.stream().filter(toggleCounter ->
                        StringUtils.equals(toggleCounter.getValue(), key)).findFirst().orElse(null);

                if (findingToggleCounter == null) {
                    summaryEvents.add(new VariationAccessCounter(key, variationCount.get(key)));
                } else {
                    findingToggleCounter.setCount(findingToggleCounter.getCount() + variationCount.get(key));
                }
            });
        });

        return summaryEvents;
    }

    protected void appendLatestVariations(List<VariationAccessCounter> accessCounters, Targeting latestTargeting,
                                          MetricType metricType) {
        TargetingContent targetingContent = TargetingVersionMapper.INSTANCE.toTargetingContent(
                latestTargeting.getContent());

        if (CollectionUtils.isEmpty(targetingContent.getVariations())) {
            return;
        }
        List<String> latestVariations = targetingContent.getVariations()
                .stream()
                .map(metricType.isNameType() ? Variation::getName : Variation::getValue)
                .collect(Collectors.toList());

        setVariationDeletedIfNotInLatest(accessCounters, latestVariations);
        appendVariationIfInLatest(accessCounters, latestVariations);
    }


    private void setVariationDeletedIfNotInLatest(List<VariationAccessCounter> accessCounters,
                                                  List<String> namesOrValues) {
        accessCounters.stream()
                .forEach(accessCounter -> accessCounter.setDeleted(!namesOrValues.contains(accessCounter.getValue())));
    }

    private void appendVariationIfInLatest(List<VariationAccessCounter> accessCounters, List<String> namesOrValues) {
        namesOrValues.forEach(value -> {
            if (!accessCounters.stream()
                    .filter(accessCounter -> StringUtils.equals(accessCounter.getValue(), value))
                    .findFirst()
                    .isPresent()) {
                accessCounters.add(new VariationAccessCounter(value, 0L));
            }
        });
    }

    protected List<VariationAccessCounter> sortAccessCounters(List<VariationAccessCounter> accessCounters) {
        Collections.sort(accessCounters, Comparator.comparingLong(VariationAccessCounter::getCount).reversed());

        List<VariationAccessCounter> deletedCounters = Lists.newArrayList();
        new ArrayList<>(accessCounters).forEach(accessCounter -> {
            if (BooleanUtils.isTrue(accessCounter.getDeleted())) {
                deletedCounters.add(accessCounter);
                accessCounters.remove(accessCounter);
            }
        });
        accessCounters.addAll(deletedCounters);
        return accessCounters;
    }


    private String queryEnvironmentServerSdkKey(String projectKey, String environmentKey) {
        Environment environment = this.environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey).get();
        return environment.getServerSdkKey();
    }

    protected boolean isGroupByDay(int queryLastHours) {
        return queryLastHours > GROUP_BY_DAY_HOURS;
    }

    private Date toDate(LocalDateTime pointStartTime) {
        return Date.from(pointStartTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    class QueryAccessEventPointTask implements Runnable {

        String serverSdkKey;
        String toggleKey;
        boolean cacheFlag;
        Targeting targeting;
        String pointNameFormat;
        LocalDateTime pointStartTime;
        LocalDateTime pointEndTime;
        List<AccessEventPoint> accessEventPoints;
        CountDownLatch counter;
        Integer sorted;
        Long tenantId;

        public QueryAccessEventPointTask(String serverSdkKey,
                                         String toggleKey,
                                         boolean cacheFlag,
                                         Targeting targeting,
                                         String pointNameFormat,
                                         LocalDateTime pointStartTime,
                                         LocalDateTime pointEndTime,
                                         List<AccessEventPoint> accessEventPoints,
                                         CountDownLatch counter,
                                         Integer sorted,
                                         Long tenantId) {
            this.serverSdkKey = serverSdkKey;
            this.toggleKey = toggleKey;
            this.cacheFlag = cacheFlag;
            this.targeting = targeting;
            this.pointNameFormat = pointNameFormat;
            this.pointStartTime = pointStartTime;
            this.pointEndTime = pointEndTime;
            this.accessEventPoints = accessEventPoints;
            this.counter = counter;
            this.sorted = sorted;
            this.tenantId = tenantId;
        }

        @Override
        public void run() {
            try {
                List<VariationAccessCounter> accessEvents;
                List<VariationAccessCounter> accessEventsCache = null;
                if (cacheFlag) {
                    accessEventsCache = queryMetricsCache(serverSdkKey, toggleKey,
                            toDate(pointStartTime), toDate(pointEndTime));
                }
                if (Objects.isNull(accessEventsCache)) {
                    List<Event> currentPointEvents =
                            eventRepository.findBySdkKeyAndToggleKeyAndStartDateGreaterThanEqualAndEndDateLessThanEqual(
                                    serverSdkKey, toggleKey, toDate(pointStartTime), toDate(pointEndTime));
                    accessEvents = toAccessEvent(currentPointEvents);
                    if (cacheFlag) {
                        saveMetricsCache(serverSdkKey, toggleKey, toDate(pointStartTime),
                                toDate(pointEndTime), accessEvents);
                    }
                } else {
                    accessEvents = accessEventsCache;
                }
                String pointName = String.format("%s",
                        pointEndTime.format(DateTimeFormatter.ofPattern(pointNameFormat)));
                Long lastTargetingVersion = queryLastTargetingVersion(targeting, pointStartTime,
                        pointEndTime, tenantId);
                accessEventPoints.add(new AccessEventPoint(pointName, accessEvents, lastTargetingVersion, sorted));
            } catch (Exception e) {
                log.error("Query AccessEventPoint Task Exception.", e);
            } finally {
                counter.countDown();
            }
        }
    }

}
