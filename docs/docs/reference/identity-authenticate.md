# Third-party authentication

## Overview

In addition to basic username and password authentication, FeatureProbe supports popular identity authentication protocols. The following are the identity authentication methods currently supported by FeatureProbe:

* LDAP

### LDAP

**Usage**:

Modify environment variables

| **Environment variable**            | **Default value**                    | Required | **Description**                                                                                                           |
|-------------------------------------|--------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------|
| app.security.ldap.url               | ldap://ldap.forumsys.com:389         | Yes      | The LDAP connection address.                                                                                              |
| app.security.ldap.userDn            | cn=read-only-admin,dc=example,dc=com | Yes      | The DN of the user connecting to LDAP, which needs query bind permission to verify other accounts.                        |
| app.security.ldap.usernameAttribute | uid                                  | Yes      | The name of LDAP schema attribute for user name.                                                                          |
| app.security.ldap.base              | dc=example,dc=com                    | Yes      | The base DN of the account to be verified.                                                                                |
| app.security.ldap.password          | password                             | Yes      | The password corresponding to UserDn.                                                                                     |
| app.security.connect.timeout        | 5000                                 | No       | The timeout for connecting to LDAP, defaulting to 5s.                                                                     |
| app.security.request.timeout        | 5000                                 | No       | The timeout for requesting LDAP, defaulting to 5s.                                                                        |
| app.security.validator.impl         | common                               | Yes      | Specifies the specific validator, which defaults to common, i.e. userpassword. To enable LDAP support, change it to ldap. |
