package com.featureprobe.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class PreferenceCreateRequest {

    List<ApprovalSettings> approvalSettings;

}

