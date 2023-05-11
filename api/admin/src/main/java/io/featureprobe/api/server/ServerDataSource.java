package io.featureprobe.api.server;

import io.featureprobe.api.dto.SdkKeyResponse;
import io.featureprobe.api.dto.ServerResponse;

public interface ServerDataSource {

    SdkKeyResponse queryAllSdkKeys() throws Exception;

    ServerResponse queryServerTogglesByServerSdkKey(String serverSdkKey) throws Exception;

}
