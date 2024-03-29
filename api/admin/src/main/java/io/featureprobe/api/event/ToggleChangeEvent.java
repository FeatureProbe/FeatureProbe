package io.featureprobe.api.event;

import org.springframework.context.ApplicationEvent;

public class ToggleChangeEvent extends ApplicationEvent {

    private final String serverSdkKey;

    public ToggleChangeEvent(String serverSdkKey, Object source) {
        super(source);
        this.serverSdkKey = serverSdkKey;
    }

    public String getServerSdkKey() {
        return serverSdkKey;
    }
}
