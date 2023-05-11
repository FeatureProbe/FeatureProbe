package io.featureprobe.api.dao.exception;

import io.featureprobe.api.base.enums.ResourceType;

public class ResourceConflictException extends RuntimeException {
    ResourceType resourceType;

    public ResourceConflictException(ResourceType resourceType) {
        this.resourceType = resourceType;
    }
}
