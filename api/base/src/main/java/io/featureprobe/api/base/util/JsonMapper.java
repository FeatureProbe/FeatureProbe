package io.featureprobe.api.base.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;

import java.util.Collections;
import java.util.List;

public class JsonMapper {

    private final static ObjectMapper mapper = new ObjectMapper();


    static {
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    }

    public static String toJSONString(Object obj) {
        try {
            if (obj == null) {
                return null;
            }
            return mapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static <T> T toObject(String content, Class<T> valueType) {
        try {
            if (StringUtils.isBlank(content)) {
                return null;
            }
            return mapper.readValue(content, valueType);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static <T> List<T> toListObject(String content, Class<T> valueType) {
        try {
            if (StringUtils.isBlank(content)) {
                return Collections.emptyList();
            }
            return mapper.readValue(content, mapper.getTypeFactory().constructCollectionType(List.class, valueType));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 将 JSON 字符串反序列化为 JsonNode，以处理所有可能的 JSON 格式
     *
     * @param content JSON 字符串
     * @return 反序列化后的 JsonNode
     */
    public static JsonNode toJsonNode(String content) {
        try {
            if (StringUtils.isBlank(content)) {
                return null;
            }
            return mapper.readTree(content);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
