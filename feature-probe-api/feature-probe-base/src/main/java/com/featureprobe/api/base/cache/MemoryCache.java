package com.featureprobe.api.base.cache;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.Weigher;

import java.util.Map;
import java.util.concurrent.ExecutionException;

public class MemoryCache<K, V> implements ICache<K, V> {

    Cache<K, V> defaultCache;

    public MemoryCache() {
        defaultCache = CacheBuilder.newBuilder().build();
    }

    private MemoryCache(long weightByte, Weigher<K, V> weigher) {
        defaultCache = CacheBuilder.newBuilder().recordStats().maximumWeight(weightByte).weigher(weigher).build();
    }

    public static MemoryCache<String, byte[]> createArrayByteCache(long maxCacheSizeMB) {
        return new MemoryCache<>(maxCacheSizeMB * 1024 * 1024, (key, value)
                -> (value != null ? value.length : 0));
    }

    @Override
    public Map<K, V> getAll(Iterable<? extends K> var1) {
        return defaultCache.getAllPresent(var1);
    }

    @Override
    public V get(K var1) throws ExecutionException {
        return defaultCache.getIfPresent(var1);
    }

    @Override
    public void put(K var1, V var2) {
        defaultCache.put(var1, var2);
    }

    @Override
    public void putAll(Map<? extends K, ? extends V> var1) {
        defaultCache.putAll(var1);
    }

    @Override
    public void invalidate(K var1) {
        defaultCache.invalidate(var1);
    }

    @Override
    public void invalidateAll() {
        defaultCache.invalidateAll();
    }

}
