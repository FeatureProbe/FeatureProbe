package com.featureprobe.api.server;

public abstract class AbstractCacheServerDataSource implements ServerDataSource {

    public static final String SDK_KEYS_CACHE_KEY = "SDK_KEYS_CACHE_KEY";

    public static final String MAX_CHANGE_LOG_ID_CACHE_KEY = "MAX_CHANGE_LOG_ID_CACHE_KEY";

    abstract void init();


}
