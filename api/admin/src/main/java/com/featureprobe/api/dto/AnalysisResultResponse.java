package com.featureprobe.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@AllArgsConstructor
@Data
public class AnalysisResultResponse {
    
    private Date start;

    private Date end;

    private Object data;
}
