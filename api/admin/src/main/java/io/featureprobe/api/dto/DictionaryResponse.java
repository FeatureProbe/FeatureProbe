package io.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;

@Data
public class DictionaryResponse {

    @Schema(description = "The key of the dictionary.")
    private String key;

    @Schema(description = "The value of the dictionary.")
    private String value;

    @Schema(description = "The modification time of the dictionary.")
    private Date modifiedTime;

    @Schema(description = "The creation time of the dictionary.")
    private Date createdTime;

}
