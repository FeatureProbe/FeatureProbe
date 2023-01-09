package com.featureprobe.api.base.util;

import org.apache.commons.lang3.time.DateUtils;

import java.text.ParseException;
import java.util.Date;

public class DateTimeTranslateUtil {

    public static String translateUnix(String datetime, String pattern) {
        try {
            Date date = DateUtils.parseDate(datetime, pattern);
            return String.valueOf(date.getTime() / 1000);
        } catch (ParseException e) {
            throw new IllegalArgumentException("datetime format error");
        }
    }

}
