package com.featureprobe.api.base.cache;

import java.util.Map;
import java.util.concurrent.ExecutionException;

public interface ICache<K, V> {

    Map<K, V> getAll(Iterable<? extends K> var1);

    V get(K var1) throws ExecutionException;

    void put(K var1, V var2);

    void putAll(Map<? extends K, ? extends V> var1);

    void invalidate(K var1);

    void invalidateAll();

}
