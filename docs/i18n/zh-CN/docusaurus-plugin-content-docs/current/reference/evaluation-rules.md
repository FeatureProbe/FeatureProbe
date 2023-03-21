---
sidebar_position: 5
---

# 开关规则计算算法

## 概述

本文档介绍用于开关规则计算的算法。

## 规则计算

所有服务端SDK 都需提供实现开关的规则计算。

SDK 的规则计算接口设计如下:
```java
private <T> T genericEvaluate(String toggleKey, FPUser user, T defaultValue)
```

规则计算分为如下步骤：

- [前置检查](#前置检查)：
- [规则检查](#规则检查)：

### 前置检查

1、如果当前开关 Key 不存在，则返回函数中预设的默认值。

2、如果开关处于未生效状态，则返回开关配置中预设的未生效分组值。

### 规则检查

在 FeatureProbe 开关规则中，匹配规则是通过多个条件子句来匹配任意用户的。为了匹配规则，必须满足所有条件子句。

SDK 会遍历规则，直到找到与给定用户匹配的第一条规则。如果规则配置的分组索引，则直接返回对应的分组值、规则的索引、开关版本和命中原因。如果规则配置的是按比例推出，则按照[推出逻辑](#百分比推出)计算命中的分组，并返回对应的分组值、规则的索引、开关版本和命中原因。

如果所有规则都未命中，则匹配默认规则。

### 条件运算符

| **运算符** | **参数类型** | **命中条件** |
| -------------------- | -------| --------------------------------------- |
| is one of            | string | 至少与其中一个值与user属性值完全匹配    |
| ends with            | string | 至少其中一个值是user属性值的尾子句    |
| starts with          | string | 至少是其中一个值是user属性值的首子句    |
| contains             | string | 至少是其中一个值是user属性值的子句       |
| matches regex        | string | 至少与其中一个正则表达式与user属性值匹配 |
| is not any of        | string | 任何一个值不与user属性值完全匹配   |
| does not end with    | string | 所有值都不是user属性值尾子句   |
| does not start with  | string | 所有值都不是user属性值首子句   |
| does not contain     | string | 所有值都不是user属性值子句     |
| does not match regex | string | 所有正则表达式都与user属性值不匹配 |
| is in                | segment | user在其中任意一个人群组中       |
| is not in            | segment | user不在所有人群组中                   |
| after                | datetime | user属性值在这个日期之后或等于该日期 |
| before               | datetime | user属性值在这个日期之前          |
| =                    | number/semver | 属性值至少等于其中一个值      |
| !=                   | number/semver | 属性值与所有值不相等           |
| >                    | number/semver | 属性值至少大其中一个值  |
| >=                   | number/semver | 属性值至少大于等于其中一个值  |
| <                    | number/semver | 属性值至少小于其中一个值  |
| <=                   | number/semver | 属性值至少小于等于其中一个值 |

当规则条件的值类型为 “segment” 时，值列表是该 segment 的唯一键，通过该键可以获取到相应的 Segment 规则。与开关的规则匹配计算类似，只要当前的 FPUser 命中了该人群组中的任意一个规则，就认为该 FPUser 属于该人群组。如果该键不存在，则认为该 FPUser 未命中该人群组。

### 百分比推出

开关规则可以配置分组按百分比推出。

百分比规则格式如下：
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

规则是由 0 到 10000 间的整数组成的 3 维数组。第一维数组的下标与分组的下标对应。第二维数组表示每个分组的权重。

为了进行分组匹配，我们只需要通过 FPUser 的 key 属性使用散列算法计算出一个 0 到 10000 间的整数值，然后查找该整数值在第二维数组中的位置，进而确定该 FPUser 命中的分组下标，即对应第一维数组的下标。

***散列算法***

1、将 FPUser 的 Key 值与开关的盐值连接，如果开关的盐值为 null，则使用开关的 Key 代替。

2、使用 SHA1 散列算法对上一步得到的字符串进行散列，生成一个散列字符串。

3、从散列字符串中取出后 4 位，并将其转换为十进制整数。

4、对上一步得到的整数进行取模操作，得到一个介于 0 到 10000 之间的整数，作为分组匹配的依据。

***参考代码(java):***
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