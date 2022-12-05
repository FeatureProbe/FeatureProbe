package com.featureprobe.api.aop;

import com.featureprobe.api.auth.TokenHelper;
import com.featureprobe.api.base.hook.Action;
import com.featureprobe.api.base.hook.IHookQueue;
import com.featureprobe.api.base.hook.Resource;
import com.featureprobe.api.base.hook.Hook;
import com.featureprobe.api.base.model.HookContext;
import com.featureprobe.api.base.tenant.TenantContext;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.LocalVariableTableParameterNameDiscoverer;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.Objects;

@Slf4j
@Aspect
@Component
public class HookAspect {

    @javax.annotation.Resource
    IHookQueue hookQueue;

    @Pointcut("@annotation(com.featureprobe.api.base.hook.Hook)")
    public void hook (){}

    @Around("hook()")
    public Object around(ProceedingJoinPoint jp) throws Throwable {
        Hook webHookAnnotation = getMethodAnnotation(jp, Hook.class);
        Action action = webHookAnnotation.action();
        Resource resource = webHookAnnotation.resource();
        HookContext context = new HookContext(resource, action);
        context.setOperator(TokenHelper.getAccount());
        context.setOrganizationId(Long.parseLong(TenantContext.getCurrentTenant()));
        Object ret = jp.proceed();
        composeParam(jp, context);
        context.setResponse(ret);
        hookQueue.push(context);
        return ret;
    }

    private void composeParam(ProceedingJoinPoint jp, HookContext context) {
        Object requestBody = getRequestBody(jp);
        if (Objects.nonNull(requestBody)) {
            context.setRequest(requestBody);
        }
        String projectKey = getProjectKeyArg(jp);
        if (StringUtils.isNotBlank(projectKey)) {
            context.setProjectKey(projectKey);
        }
        String environmentKey = getEnvironmentKeyArg(jp);
        if(StringUtils.isNotBlank(environmentKey)) {
            context.setEnvironmentKey(environmentKey);
        }
        String toggleKey = getToggleKeyArg(jp);
        if (StringUtils.isNotBlank(toggleKey)) {
            context.setToggleKey(toggleKey);
        }
        String segmentKey = getSegmentKeyArg(jp);
        if (StringUtils.isNotBlank(segmentKey)) {
            context.setSegmentKey(segmentKey);
        }
        Long id = getIdArg(jp);
        if (Objects.nonNull(id)){
            context.setId(id);
        }
    }

    private Object getRequestBody(ProceedingJoinPoint jp) {
        MethodSignature signature = (MethodSignature) jp.getSignature();
        Method method = signature.getMethod();
        Annotation[][] parameterAnnotations = method.getParameterAnnotations();
        Object[] args = jp.getArgs();
        for (int i = 0 ; i < parameterAnnotations.length; i++) {
            for (Annotation annotation : parameterAnnotations[i]) {
                if (annotation instanceof RequestBody) {
                    return args[i];
                }
            }
        }
        return null;
    }

    private String getProjectKeyArg(ProceedingJoinPoint jp) {
        Object projectKey = getPathArg(jp, "projectKey");
        if (Objects.isNull(projectKey)) {
            return null;
        }
        return String.valueOf(projectKey);
    }

    private String getEnvironmentKeyArg(ProceedingJoinPoint jp) {
        Object environmentKey = getPathArg(jp, "environmentKey");
        if (Objects.isNull(environmentKey)) {
            return null;
        }
        return String.valueOf(environmentKey);
    }

    private String getToggleKeyArg(ProceedingJoinPoint jp) {
        Object toggleKey = getPathArg(jp, "toggleKey");
        if (Objects.isNull(toggleKey)) {
            return null;
        }
        return String.valueOf(toggleKey);
    }

    private String getSegmentKeyArg(ProceedingJoinPoint jp) {
        Object segmentKey = getPathArg(jp, "segmentKey");
        if (Objects.isNull(segmentKey)) {
            return null;
        }
        return String.valueOf(segmentKey);
    }

    private Long getIdArg(ProceedingJoinPoint jp) {
        Object idArg = getPathArg(jp, "id");
        Long id = null;
        if (Objects.isNull(idArg)) {
            return null;
        }
        try {
            id = (Long) idArg;
        } catch (Exception e) {
            return null;
        }
        return id;
    }

    private Object getPathArg(ProceedingJoinPoint jp, String name) {
        MethodSignature signature = (MethodSignature) jp.getSignature();
        Method method = signature.getMethod();
        Annotation[][] parameterAnnotations = method.getParameterAnnotations();
        Object[] args = jp.getArgs();
        for (int i = 0 ; i < parameterAnnotations.length; i++) {
            for (Annotation annotation : parameterAnnotations[i]) {
                if (annotation instanceof PathVariable && ((PathVariable) annotation).value().equals(name)) {
                    return args[i];
                }
            }
        }
        return null;
    }

    private <T extends Annotation> T getMethodAnnotation(JoinPoint joinPoint, Class<T> clazz) {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        Method method = methodSignature.getMethod();
        return method.getAnnotation(clazz);
    }

}
