package com.featureprobe.api.hook;

import com.featureprobe.api.base.hook.IHookQueue;
import com.featureprobe.api.base.model.HookContext;
import org.springframework.stereotype.Component;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

@Component
public class MemoryHookQueue implements IHookQueue {

    private final BlockingQueue<HookContext> eventQueue = new ArrayBlockingQueue<>(10000);

    @Override
    public boolean push(HookContext hookContext) {
        return eventQueue.offer(hookContext);
    }

    @Override
    public HookContext take() throws Exception {
        return eventQueue.take();
    }

}
