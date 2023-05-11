package io.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VariationAccessCounter {

    @Schema(description = "The value of the variation.")
    @NotBlank
    private String value;

    @Schema(description = "The total number of hits for the variation.")
    @NotNull
    private Long count;

    @Schema(description = "The version of the variation.")
    @NotNull
    private Long version;

    @Schema(description = "The index of the variations.")
    @NotNull
    private Integer index;

    @Schema(description = "Whether the variation has been deleted.")
    private Boolean deleted;

    public VariationAccessCounter(String value, Long count) {
        this.value = value;
        this.count = count;
    }


}
