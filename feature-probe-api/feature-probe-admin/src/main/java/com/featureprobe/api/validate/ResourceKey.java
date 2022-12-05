package com.featureprobe.api.validate;


import com.featureprobe.api.base.enums.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
public class ResourceKey {

    ResourceType type;
    String key;

    public boolean isProject() {
        return type == ResourceType.PROJECT;
    }

    public boolean isEnvironment() {
        return type == ResourceType.ENVIRONMENT;
    }

    public boolean isToggle() {
        return type == ResourceType.TOGGLE;
    }

    public boolean isSegment() {
        return type == ResourceType.SEGMENT;
    }
}
