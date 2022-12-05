package com.featureprobe.api.server;

import com.featureprobe.api.base.cache.ICache;
import com.featureprobe.api.base.enums.ChangeLogType;
import com.featureprobe.api.base.util.JsonMapper;
import com.featureprobe.api.dao.entity.PublishMessage;
import com.featureprobe.api.dao.repository.PublishMessageRepository;
import com.featureprobe.api.dto.SdkKeyResponse;
import com.featureprobe.api.dto.ServerResponse;
import com.featureprobe.api.service.BaseServerService;
import com.google.common.annotations.VisibleForTesting;
import com.google.common.util.concurrent.ThreadFactoryBuilder;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.time.StopWatch;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@AllArgsConstructor
@Slf4j
public class CacheServerDataSource extends AbstractCacheServerDataSource {

    ICache<String, byte[]> cache;

    private PublishMessageRepository publishMessageRepository;

    private BaseServerService baseServerService;

    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor(
            new ThreadFactoryBuilder()
                    .setDaemon(true)
                    .setNameFormat("FeatureProbe-Cache-Updater-%d")
                    .setPriority(Thread.MIN_PRIORITY)
                    .build());

    @Override
    public SdkKeyResponse queryAllSdkKeys() throws Exception {
        byte[] bytes = cache.get(SDK_KEYS_CACHE_KEY);
        return Objects.isNull(bytes) ? null : JsonMapper.toObject(new String(bytes), SdkKeyResponse.class);
    }

    @Override
    public ServerResponse queryServerTogglesByServerSdkKey(String serverSdkKey) throws Exception {
        byte[] bytes = cache.get(serverSdkKey);
        return Objects.isNull(bytes) ? null : JsonMapper.toObject(new String(bytes), ServerResponse.class);
    }


    @PostConstruct
    public void init() {
        StopWatch watcher = new StopWatch();
        watcher.start();
        log.info("FeatureProbe API start initialization cache .");
        List<PublishMessage> publishMessages = publishMessageRepository.findAll(PageRequest.of(0, 1,
                Sort.Direction.DESC,
                "id")).getContent();
        PublishMessage maxId = CollectionUtils.isNotEmpty(publishMessages) ? publishMessages.get(0) :
                new PublishMessage(0L);
        cache.put(CacheServerDataSource.MAX_CHANGE_LOG_ID_CACHE_KEY, JsonMapper.toJSONString(maxId).getBytes());
        SdkKeyResponse sdkKeyResponse = baseServerService.queryAllSdkKeys();
        cache.put(CacheServerDataSource.SDK_KEYS_CACHE_KEY, JsonMapper.toJSONString(sdkKeyResponse).getBytes());
        Map<String, byte[]> allServerToggle = baseServerService.queryAllServerToggle();
        cache.putAll(allServerToggle);
        watcher.stop();
        log.info("FeatureProbe API initialization cache finished . Time : "
                + watcher.getTime(TimeUnit.SECONDS) + " s");
        scheduler.scheduleAtFixedRate(this::handleChangeLog, 0L, 200, TimeUnit.MILLISECONDS);
    }

    @VisibleForTesting
    private void handleChangeLog() {
        try {
            PublishMessage maxPublishMessage = JsonMapper.toObject(new String(
                    cache.get(CacheServerDataSource.MAX_CHANGE_LOG_ID_CACHE_KEY)), PublishMessage.class);
            List<PublishMessage> publishMessages = publishMessageRepository
                    .findAllByIdGreaterThanOrderByIdAsc(maxPublishMessage.getId());
            if (CollectionUtils.isNotEmpty(publishMessages)) {
                cache.put(CacheServerDataSource.MAX_CHANGE_LOG_ID_CACHE_KEY,
                        JsonMapper.toJSONString(publishMessages.get(publishMessages.size() - 1)).getBytes());
                Map<String, ChangeLogType> logGroup = new HashMap<>();
                boolean isUpdateSdkKey = false;
                for (PublishMessage publishMessage : publishMessages) {
                    logGroup.put(publishMessage.getServerSdkKey(), publishMessage.getType());
                    if (publishMessage.getType() == ChangeLogType.ADD ||
                            publishMessage.getType() == ChangeLogType.DELETE) {
                        isUpdateSdkKey = true;
                    }
                }
                if (isUpdateSdkKey) {
                    cache.put(CacheServerDataSource.SDK_KEYS_CACHE_KEY,
                            JsonMapper.toJSONString(baseServerService.queryAllSdkKeys()).getBytes());
                }
                for (String serverSdkKey : logGroup.keySet()) {
                    refreshCache(serverSdkKey, logGroup.get(serverSdkKey));
                }
            }
        } catch (Exception e) {
            log.error("Cache update error. ", e);
        }
    }

    private void refreshCache(String serverSdkKey, ChangeLogType type) {
        switch (type) {
            case ADD:
            case CHANGE:
                cache.put(serverSdkKey,
                        JsonMapper.toJSONString(baseServerService.queryServerTogglesByServerSdkKey(serverSdkKey))
                                .getBytes());
                break;
            case DELETE:
                cache.invalidate(serverSdkKey);
                break;
            default:
                break;
        }
    }

}
