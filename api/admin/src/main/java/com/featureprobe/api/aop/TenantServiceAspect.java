package com.featureprobe.api.aop;

import com.featureprobe.api.base.db.Archived;
import com.featureprobe.api.base.db.ExcludeTenant;
import com.featureprobe.api.base.db.IncludeDeleted;
import com.featureprobe.api.base.tenant.TenantContext;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.hibernate.Session;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Objects;

@Slf4j
@Aspect
@Component
@Order(0)
public class TenantServiceAspect {

    @Before("execution(* com.featureprobe.api.service..*.*(..))")
    public void beforeExecution(JoinPoint pjp) throws Throwable {
        Class<?> clazz = pjp.getTarget().getClass();
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            if (StringUtils.equals("entityManager", field.getName())) {
                field.setAccessible(true);
                EntityManager entityManager = (EntityManager) field.get(pjp.getTarget());
                Session session = entityManager.unwrap(Session.class);
                ExcludeTenant excludeTenantAnnotation = clazz.getAnnotation(ExcludeTenant.class);
                ExcludeTenant excludeTenantMethodAnnotation = getMethodAnnotation(pjp, ExcludeTenant.class);
                if (Objects.isNull(excludeTenantAnnotation) && Objects.isNull(excludeTenantMethodAnnotation)) {
                    session.enableFilter("tenantFilter").setParameter("organizationId",
                                    Long.parseLong(TenantContext.getCurrentTenant()))
                            .validate();
                }
                IncludeDeleted includeDeletedAnnotation = getMethodAnnotation(pjp, IncludeDeleted.class);
                if (Objects.isNull(includeDeletedAnnotation)) {
                    session.enableFilter("deletedFilter").setParameter("deleted", false)
                            .validate();
                }
                Archived archivedAnnotation = getMethodAnnotation(pjp, Archived.class);
                if (Objects.isNull(archivedAnnotation)) {
                    session.enableFilter("archivedFilter").setParameter("archived", false).validate();
                } else if (Objects.nonNull(session.getEnabledFilter("archivedFilter"))) {
                    session.disableFilter("archivedFilter");
                }
            }
        }
    }

    @After("execution(* com.featureprobe.api.service..*.*(..))")
    public void afterExecution(JoinPoint pjp) throws Throwable {
        Class<?> clazz = pjp.getTarget().getClass();
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            if (StringUtils.equals("entityManager", field.getName())) {
                field.setAccessible(true);
                EntityManager entityManager = (EntityManager) field.get(pjp.getTarget());
                Session session = entityManager.unwrap(Session.class);
                session.disableFilter("tenantFilter");
                session.disableFilter("deletedFilter");
                session.disableFilter("archivedFilter");
            }
        }
    }


    private <T extends Annotation> T getMethodAnnotation(JoinPoint joinPoint, Class<T> clazz) {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        Method method = methodSignature.getMethod();
        return method.getAnnotation(clazz);
    }

}
