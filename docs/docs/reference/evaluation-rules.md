---
sidebar_position: 5
---

# Rule Evaluation

## Overview

This document introduces the algorithm used for feature flag rule calculation.

## Rule calculation

All server-side SDKs need to provide implementation of feature flag rule calculation.

The interface design for SDK's rule calculation is as follows:
```java
private <T> T genericEvaluate(String toggleKey, FPUser user, T defaultValue)
```

Rule calculation consists of the following steps:

- [Pre-check](#pre-check)：
- [Rule-check](#rule-check)：

### Pre-check

1、If the current feature flag key does not exist, return the default value set in the function.

2、If the feature flag is in an disabled state, return the preset disabled group value in the feature flag configuration.

### Rule-check

1、In FeatureProbe feature flag rules, matching rules are matched to any user through multiple conditional clauses. To match the rule, all conditional clauses must be satisfied.

2、The SDK will iterate through the rules until it finds the first rule that matches the given user. If the rule is configured with a group index, it directly returns the corresponding group value, rule index, feature flag version, and hit reason. If the rule is configured to be rolled out by percentage, the hit group is calculated according to the [rollout logic](#rollout), and the corresponding group value, rule index, feature flag version, and hit reason are returned.

3、If none of the rules are hit, match the default rule.

### Conditional operators

| **Operators** | **Parameter types** | **Matching conditions** |
| -------------------- | -------| --------------------------------------- |
| is one of            | string | The user attribute value exactly matches the clause value |
| ends with            | string | The user attribute value ends with the clause value |
| starts with          | string | The user attribute value starts with the clause value     |
| contains             | string | The user attribute value contains the clause value   |
| matches regex        | string | The user attribute value matches at least one regular expression |
| is not any of        | string | The user attribute value not matches the clause value   |
| does not end with    | string | The user attribute value not ends with the clause value   |
| does not start with  | string | The user attribute value not starts with the clause value   |
| does not contain     | string | The user attribute value not contains the clause value     |
| does not match regex | string | The user attribute value not matches at least one regular expression |
| is in                | segment | The user is at least in one of your segment  |
| is not in            | segment | The user does not belong to any segment                  |
| after                | datetime | The user attribute value of the user is after or equal to the given date |
| before               | datetime | The user attribute value of the user is before the given date          |
| =                    | number/semver |    least equal to one of  |
| !=                   | number/semver |    not equal to all           |
| >                    | number/semver |    least greater than one of  |
| >=                   | number/semver |    least greater than or equal to one of |
| <                    | number/semver |    least less than one of  |
| <=                   | number/semver |    least less than or equal to one of |

When the value type of the rule condition is "segment", the value list is the unique key of that segment, and the corresponding segment rule can be obtained through this key. Similar to the feature flag rule matching calculation, as long as the current FPUser hits any rule in the population group, it is considered that the FPUser belongs to that population group. If the key does not exist, it is considered that the FPUser does not belong to that population group.

### Rollout

feature flag can be configured to push out groups by percentage.

The format of percentage rules is as follows：
```json
[
    [
        [
            0,
            3333
        ]
    ],
    [
        [
            3333,
            6666
        ]
    ],
    [
        [
            6666,
            10000
        ]
    ]
]
```

The rules are a 3-dimensional array consisting of integers between 0 and 10000. The index of the first dimension array corresponds to the index of the grouping. The second-dimensional array represents the weight of each group.

To perform group matching, we only need to use the hash algorithm through the key property of FPUser to calculate an integer value between 0 and 10000, and then look up the position of the integer value in the second-dimensional array to determine the grouping index that the FPUser hits, that is, corresponding to the index of the first-dimensional array.

***Hash algorithm***

1、Concatenate the Key value of FPUser with the salt value of the feature flag. If the salt value of the feature flag is null, use the Key of the feature flag instead.

2、The previous concatenated string with SHA1 hash algorithm resulting in a hash string.

3、Extract the last 4 characters from the hash string and convert it into a decimal integer.

4、Perform a modulo operation on the integer obtained in the previous step, resulting in an integer between 0 and 10000 that will serve as the basis for group matching.

***Reference (java):***
```java
private int hash(String hashKey, String hashSalt, int bucketSize) {
    String value = hashKey + hashSalt;
    byte[] hashValue;
    MessageDigest messageDigest;
    try {
        messageDigest = MessageDigest.getInstance("SHA-1");
        messageDigest.update(value.getBytes(StandardCharsets.UTF_8));
        hashValue = messageDigest.digest();
    } catch (NoSuchAlgorithmException e) {
        throw new RuntimeException("couldn't clone MessageDigest object", e);
    }
    byte[] bytes = Arrays.copyOfRange(hashValue, hashValue.length - 4, hashValue.length);
    return new BigInteger(1, bytes).mod(BigInteger.valueOf(bucketSize)).intValue();
}
```