package com.featureprobe.api.server;

import com.featureprobe.api.dto.SdkKeyResponse;
import com.featureprobe.api.dto.ServerResponse;

public interface ServerDataSource {

    SdkKeyResponse queryAllSdkKeys() throws Exception;

    ServerResponse queryServerTogglesByServerSdkKey(String serverSdkKey) throws Exception;

}
