package com.featureprobe.api.dao.exception;

import com.featureprobe.api.base.enums.ResourceType;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceType resourceType;
    public String resourceKey;

    public ResourceNotFoundException(ResourceType resourceType, String resourceKey) {
        this.resourceKey = resourceKey;
        this.resourceType = resourceType;
    }

}
