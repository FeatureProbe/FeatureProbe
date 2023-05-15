package io.featureprobe.api.dto;

import io.featureprobe.api.base.util.JsonMapper;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CertificationUserResponse {

    private String account;
    private String role;
    private Long organizeId;

    private String token;

    public String toJSONString() {
        return JsonMapper.toJSONString(this);
    }
}
