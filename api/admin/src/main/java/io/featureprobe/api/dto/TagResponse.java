package io.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;


@Data
public class TagResponse {

    @Schema(description = "The name of the tag.")
    private String name;

}
