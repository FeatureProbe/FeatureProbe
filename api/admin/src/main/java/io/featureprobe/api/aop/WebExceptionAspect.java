package io.featureprobe.api.aop;


import io.featureprobe.api.base.constants.MessageKey;
import io.featureprobe.api.base.constants.ResponseCode;
import io.featureprobe.api.base.exception.ForbiddenException;
import io.featureprobe.api.base.model.BaseResponse;
import io.featureprobe.api.base.util.JsonMapper;
import io.featureprobe.api.component.I18nConverter;
import io.featureprobe.api.dao.exception.ResourceConflictException;
import io.featureprobe.api.dao.exception.ResourceNotFoundException;
import io.featureprobe.api.dao.exception.ResourceOverflowException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.persistence.OptimisticLockException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@AllArgsConstructor
@ControllerAdvice
@Slf4j
public class WebExceptionAspect {

    I18nConverter i18nConverter;

    @ExceptionHandler(value = ResourceNotFoundException.class)
    public void resourceNotFoundHandler(HttpServletResponse response, ResourceNotFoundException e)
            throws IOException {
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        String resourceNameMessage = i18nConverter.getResourceNameMessage(e.resourceType);
        String resourceNotFoundMessage = i18nConverter.get(ResponseCode.NOT_FOUND.messageKey(),
                new Object[]{resourceNameMessage, e.resourceKey});

        response.getWriter().write(toErrorResponse(ResponseCode.NOT_FOUND, resourceNotFoundMessage));
    }

    @ExceptionHandler(value = ResourceOverflowException.class)
    public void resourceOverflowHandler(HttpServletResponse response, ResourceOverflowException e)
            throws IOException {
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        String resourceNameMessage = i18nConverter.getResourceNameMessage(e.resourceType);
        String resourceOverflowMessage = i18nConverter.get(ResponseCode.NOT_FOUND.messageKey(),
                new Object[]{resourceNameMessage});

        response.getWriter().write(toErrorResponse(ResponseCode.OVERFLOW, resourceOverflowMessage));
    }

    @ExceptionHandler(value = ResourceConflictException.class)
    public void resourceConflictHandler(HttpServletResponse response)
            throws IOException {
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write(toErrorResponse(ResponseCode.CONFLICT));
    }


    @ExceptionHandler(value = ForbiddenException.class)
    public void forbiddenHandler(HttpServletResponse response, ForbiddenException e)
            throws IOException {
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write(toErrorResponse(ResponseCode.FORBIDDEN));
    }


    @ExceptionHandler(value = {IllegalArgumentException.class, OptimisticLockException.class})
    public void invalidArgumentHandler(HttpServletResponse response, RuntimeException e)
            throws IOException {
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        String messageKey = e.getMessage();
        if (e instanceof OptimisticLockException) {
            messageKey = MessageKey.CONFLICT_REQUEST;
        }
        response.getWriter().write(toErrorResponse(ResponseCode.INVALID_REQUEST, i18nConverter.get(messageKey)));
        log.warn("invalidArgumentHandler", e);
    }

    private String toErrorResponse(ResponseCode resourceCode) {
        return toErrorResponse(resourceCode, i18nConverter.get(resourceCode.messageKey()));
    }

    private String toErrorResponse(ResponseCode responseCode, String message) {
        return JsonMapper.toJSONString(new BaseResponse(responseCode.code(), message));
    }

}
