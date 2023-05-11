package io.featureprobe.api.base.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class PrerequisiteModel {

    @Schema(description = "key for toggle.")
    private String key;

    @Schema(description = "value for toggle variation.")
    private String value;

    @Schema(description = "type for toggle.")
    private String type;

    public interface ValueConverter<T> {
        T convert(String value);
    }

}
