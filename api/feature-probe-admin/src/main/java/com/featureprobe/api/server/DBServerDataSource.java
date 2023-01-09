package com.featureprobe.api.server;

import com.featureprobe.api.dto.SdkKeyResponse;
import com.featureprobe.api.dto.ServerResponse;
import com.featureprobe.api.service.BaseServerService;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class DBServerDataSource implements ServerDataSource {

    BaseServerService baseServerService;


    @Override
    public SdkKeyResponse queryAllSdkKeys() {
        return baseServerService.queryAllSdkKeys();
    }

    @Override
    public ServerResponse queryServerTogglesByServerSdkKey(String serverSdkKey) {
        return baseServerService.queryServerTogglesByServerSdkKey(serverSdkKey);
    }
}
