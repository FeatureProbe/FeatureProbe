package io.featureprobe.api.dao.exception;

import io.featureprobe.api.base.enums.ResourceType;

public class ResourceOverflowException extends RuntimeException {

    public ResourceType resourceType;

    public ResourceOverflowException(ResourceType resourceType) {
        this.resourceType = resourceType;
    }

}
