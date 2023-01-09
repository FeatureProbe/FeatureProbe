package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.PaginationRequest;
import lombok.Data;

@Data
public class TargetingVersionRequest extends PaginationRequest {

    private Long version;

}
