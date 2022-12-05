package com.featureprobe.api.component;

import com.google.common.annotations.VisibleForTesting;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class SpringBeanManager implements ApplicationContextAware {

    @VisibleForTesting
    private static ApplicationContext applicationContext = null;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }

    public static <T>T getBeanByName(String beanName){
        return (T) applicationContext.getBean(beanName);
    }

    public static <T>T getBeanByType(Class<T> clazz){
        return (T) applicationContext.getBean(clazz);
    }

}
