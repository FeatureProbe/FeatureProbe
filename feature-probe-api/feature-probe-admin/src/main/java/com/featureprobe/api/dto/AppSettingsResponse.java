package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.LoginMode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppSettingsResponse {

    public LoginMode loginMode;
    public String serverURI;

}
