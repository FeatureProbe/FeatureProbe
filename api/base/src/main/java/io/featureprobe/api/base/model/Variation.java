package io.featureprobe.api.base.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class Variation {

    @Schema(description = "A custom value for the variation.")
    private String value;

    @Schema(description = "A human-friendly name for the variation.")
    private String name;

    @Schema(description = "A custom description for the variation.")
    private String description;

    public interface ValueConverter<T> {
        T convert(String value);
    }
}
