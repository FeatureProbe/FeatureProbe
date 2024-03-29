package io.featureprobe.api.dto;

import io.featureprobe.api.base.model.PaginationRequest;
import lombok.Data;

@Data
public class TargetingVersionRequest extends PaginationRequest {

    private Long version;

}
