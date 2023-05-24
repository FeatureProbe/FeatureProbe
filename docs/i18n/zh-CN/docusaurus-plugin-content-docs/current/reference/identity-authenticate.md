---
sidebar_position: 12
---

# 第三方身份验证

## 概述

除了基础的账号密码登录，FeatureProbe还支持流行的身份认证协议，
以下是FeatureProbe目前支持的身份认证方式。
* LDAP

### LDAP

**使用方式**:

修改环境变量

| **Environment variable** | **Default value**                    | Required | **Description**                                        |
|-------------------------|--------------------------------------|----------|--------------------------------------------------------|
| app.security.ldap.url   | ldap://ldap.forumsys.com:389         | 是        | LDAP连接地址。                                              |
| app.security.ldap.userDn | cn=read-only-admin,dc=example,dc=com | 是        | 连接LDAP的用户DN，该DN需要有查询bind的权限，用于验证其他账号                   |
| app.security.ldap.base  | dc=example,dc=com                    | 是        | 待验证账号的baseDN                                           |
| app.security.ldap.password | password                             | 是        | 和UserDn对应的Password                                     |
| app.security.connect.timeout | 5000                                 | 否        | 与Ldap建联的超时时间，默认5s                                      |
| app.security.request.timeout | 5000                                 | 否        | 请求LDAP的超时时间，默认5s                                       |
| app.security.validator.impl | common                               | 是        | 指定具体的验证器，默认是common,也就是userpassword，需要开启ldap支持，则要改成ldap |
提示: 目前FeatureProbe是在LDAP Server上验证uid属性。