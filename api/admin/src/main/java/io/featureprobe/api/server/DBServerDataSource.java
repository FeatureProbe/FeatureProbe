package io.featureprobe.api.server;

import io.featureprobe.api.dto.SdkKeyResponse;
import io.featureprobe.api.dto.ServerResponse;
import io.featureprobe.api.service.BaseServerService;
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
