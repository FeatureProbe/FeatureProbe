package com.featureprobe.api.base.util;

import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

public class RegexValidator {

    public static boolean validateRegex(String regex) {
        try {
            Pattern.compile(regex);
            return true;
        } catch (PatternSyntaxException exception) {
            return false;
        }
    }

}
