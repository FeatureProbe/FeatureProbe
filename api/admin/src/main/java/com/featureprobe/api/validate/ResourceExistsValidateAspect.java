package com.featureprobe.api.validate;

import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.dao.repository.ProjectRepository;
import com.featureprobe.api.dao.repository.SegmentRepository;
import com.featureprobe.api.dao.repository.ToggleRepository;
import com.featureprobe.api.base.enums.ResourceType;
import com.google.common.collect.Lists;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;

import java.lang.reflect.Parameter;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.IntStream;

@Aspect
@Component
@Slf4j
@AllArgsConstructor
public class ResourceExistsValidateAspect {

    ProjectRepository projectRepository;
    ToggleRepository toggleRepository;
    EnvironmentRepository environmentRepository;
    SegmentRepository segmentRepository;

    @Around(value = "@within(resourceExistsValidate)")
    public Object validate(ProceedingJoinPoint joinPoint, ResourceExistsValidate resourceExistsValidate)
            throws Throwable {
        if (joinPoint.getSignature() instanceof MethodSignature) {
            validateResourceKeyExists(joinPoint);
        }
        return joinPoint.proceed();
    }

    private void validateResourceKeyExists(ProceedingJoinPoint joinPoint) {
        List<ResourceKey> resourceKeys = parseResourceKeys(joinPoint);
        if (resourceKeys.isEmpty()) {
            return;
        }
        validateResourceKeyExists(resourceKeys);
    }

    protected void validateResourceKeyExists(List<ResourceKey> resourceKeys) {
        ResourceKey projectKey = filterFirstResourceKey(resourceKeys, ResourceKey::isProject);
        if (projectKey == null) {
            return;
        }
        validateProjectExists(projectKey);
        validateToggleExists(projectKey, resourceKeys);
        validateEnvironmentExists(projectKey, resourceKeys);
        validateSegmentExists(projectKey, resourceKeys);
    }

    protected void validateProjectExists(ResourceKey projectKey) {
        if (projectKey == null || StringUtils.isBlank(projectKey.key)) {
            return;
        }
        if (!projectRepository.existsByKey(projectKey.key)) {
            throwResourceNotFoundException(projectKey);
        }
    }

    protected void validateEnvironmentExists(ResourceKey projectKey, List<ResourceKey> resourceKeys) {
        ResourceKey environmentKey = filterFirstResourceKey(resourceKeys, ResourceKey::isEnvironment);
        if (environmentKey == null) {
            return;
        }
        if (!environmentRepository.existsByProjectKeyAndKey(projectKey.key, environmentKey.getKey())) {
            throwResourceNotFoundException(environmentKey);
        }
    }

    protected void validateToggleExists(ResourceKey projectKey, List<ResourceKey> resourceKeys) {
        ResourceKey toggleKey = filterFirstResourceKey(resourceKeys, ResourceKey::isToggle);
        if (toggleKey == null) {
            return;
        }
        if (!toggleRepository.existsByProjectKeyAndKey(projectKey.key, toggleKey.getKey())) {
            throwResourceNotFoundException(toggleKey);
        }
    }

    protected void validateSegmentExists(ResourceKey projectKey, List<ResourceKey> resourceKeys) {
        ResourceKey segmentKey = filterFirstResourceKey(resourceKeys, ResourceKey::isSegment);
        if (segmentKey == null) {
            return;
        }
        if (!segmentRepository.existsByProjectKeyAndKey(projectKey.key, segmentKey.getKey())) {
            throwResourceNotFoundException(segmentKey);
        }

    }

    private ResourceKey filterFirstResourceKey(List<ResourceKey> resourceKeys, Predicate<ResourceKey> filter) {
        ResourceKey resourceKey = resourceKeys.stream().filter(filter).findFirst().orElse(null);
        if (resourceKey == null || StringUtils.isBlank(resourceKey.key)) {
            return null;
        }
        return resourceKey;
    }

    protected List<ResourceKey> parseResourceKeys(ProceedingJoinPoint joinPoint) {
        List<ResourceKey> resourceKeys = Lists.newArrayList();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Object[] methodArgs = joinPoint.getArgs();
        Parameter[] parameters = signature.getMethod().getParameters();

        IntStream.range(0, parameters.length).forEach(index -> {
            ResourceKey resourceKey = parseResourceKey(methodArgs, parameters, index);
            if (resourceKey != null) {
                resourceKeys.add(resourceKey);
            }
        });

        return resourceKeys;
    }

    private ResourceKey parseResourceKey(Object[] methodArgs, Parameter[] parameters, int index) {
        PathVariable pathVariable = parameters[index].getAnnotation(PathVariable.class);
        String paramName = pathVariable != null ? pathVariable.name() : parameters[index].getName();
        ResourceType resourceType = ResourceType.of(paramName);
        if (resourceType == null) {
            return null;
        }
        if (StringUtils.equals(paramName, resourceType.getParamName())) {
            return new ResourceKey(resourceType, String.valueOf(methodArgs[index]));
        }
        return null;
    }

    private void throwResourceNotFoundException(ResourceKey resourceKey) {
        throw new ResourceNotFoundException(resourceKey.type, resourceKey.getKey());
    }
}
