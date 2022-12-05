package com.featureprobe.api.dto;

import lombok.Data;

import java.util.Date;

@Data
public class DictionaryResponse {

    private String key;

    private String value;

    private Date modifiedTime;

    private Date createdTime;

}
