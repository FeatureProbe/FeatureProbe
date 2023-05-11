package io.featureprobe.api.base.util;

import org.apache.commons.lang3.StringUtils;

public class ToggleContentLimitChecker {

    private static final long DEFAULT_MAX_LENGTH = 1024 * 1024;

    public static boolean isOverLimitSize(String content, long maxLength){
        if (StringUtils.isEmpty(content)) {
            return false;
        }
        try {
           return content.getBytes().length > maxLength;
        } catch (Exception e) {
        }
        return true;
    }

    public static boolean isOverLimitSize(String content){
        return isOverLimitSize(content, DEFAULT_MAX_LENGTH);
    }

    public static void validateSize(String content) {
        if (isOverLimitSize(content)) {
            throw new IllegalArgumentException("validate.targeting_content_over_limit");
        }
    }

}
