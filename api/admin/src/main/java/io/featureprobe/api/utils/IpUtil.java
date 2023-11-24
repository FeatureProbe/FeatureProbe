package io.featureprobe.api.utils;

import org.apache.commons.validator.routines.InetAddressValidator;

import javax.servlet.http.HttpServletRequest;

public class IpUtil {

    private final static String UNKNOWN_HEADER_VALUE = "unknown";

    public static String getRemoteIp(HttpServletRequest request) {
        String remoteIp;
        remoteIp = request.getHeader("x-forwarded-for");
        if (remoteIp == null || remoteIp.isEmpty() || UNKNOWN_HEADER_VALUE.equalsIgnoreCase(remoteIp)) {
            remoteIp = request.getHeader("X-Real-IP");
        }
        if (remoteIp == null || remoteIp.isEmpty() || UNKNOWN_HEADER_VALUE.equalsIgnoreCase(remoteIp)) {
            remoteIp = request.getRemoteHost();
        }
        return remoteIp;
    }

    public static boolean isValidIp(String ip) {
        InetAddressValidator validator = InetAddressValidator.getInstance();
        return validator.isValid(ip);
    }

}
