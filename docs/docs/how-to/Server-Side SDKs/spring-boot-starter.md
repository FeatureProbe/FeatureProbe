---
sidebar_position: 2
---

# Spring Boot Starter

Feature Probe is an open source feature management service. 
This article describes how to use the FeatureProbe SDK in a Spring Boot project.

:::tip
For users who use FeatureProbe for the first time, we strongly recommend that you return to this article after reading [Grayscale Volume Tutorial](../../tutorials/rollout_tutorial/)
:::

## Access FeatureProbe

For the Spring Boot project, FeatureProbe provides an out of the box starter to facilitate the rapid integration of FeatureProbe in Spring Boot.

:::info
The service SDK uses asynchronous connection to the FeatureProbe server to pull the decision rules,
and the decision rules will be cached locally. All interfaces exposed to user code only involve memory operations, 
so you don't need to worry about performance issues when calling.
:::

### Step 1. Install FeatureProbe Starter

First, install the FeatureProbe Starter as a dependency in your application.

#### Apache Maven

```xml
<dependency>
    <groupId>com.featureprobe</groupId>
    <artifactId>featureprobe-spring-boot-starter</artifactId>
    <version>1.4.0</version>
</dependency>
```

#### Gradle Groovy DSL

```text
implementation 'com.featureprobe:featureprobe-spring-boot-starter:1.4.0'
```

### Step 2. Config FeatureProbe instance

After installing and importing Starter, configure the required FeatureProbe instance according to the current environment.

```yaml
spring:
  featureprobe:
    event-url: https://featureprobe.io/server/api/events
    synchronizer-url: https://featureprobe.io/server/api/server-sdk/toggles
    sdk-key: server-9e53c5db4fd75049a69df8881f3bc90edd58fb06
    refresh-interval: 5
```

| config                               | describe                          | required |
|:-------------------------------------|:----------------------------------|---------:|
| spring.featureprobe.event-url        | events upload Url                 |        Y |
| spring.featureprobe.synchronizer-url | toggle data synchronization Url              |        Y |
| spring.featureprobe.sdk-key          | current environment SDK KEY       |        Y |
| spring.featureprobe.refresh-interval | data synchronization frequency（s） |        N |



### Step 3. Use the feature toggle

You can use sdk to check which variation a particular user will receive for a given feature flag.

```java
@Resource
FeatureProbe fpClient;
```

```java
FPUser user=new FPUser();
user.with("ATTRIBUTE_NAME_IN_RULE",VALUE_OF_ATTRIBUTE);    // Call with() for each attribute used in Rule.
boolean boolValue=fpClient.boolValue("YOUR_TOGGLE_KEY",user,false);
if(boolValue){
// the code to run if the toggle is on
}else{
// the code to run if the toggle is off
}
```

### Step 4. Close FeatureProbe Client

Close the client before exiting to ensure accurate data reporting.

```java
fpClient.close();
```

## Mock FeatureProbe for Unittest

You can mock FeatureProbe SDK returned value, to run unittest of your code.

### 1. Install powermock SDK:

```xml
<dependency>
    <groupId>org.powermock</groupId>
    <artifactId>powermock-api-mockito2</artifactId>
    <version>2.0.9</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.powermock</groupId>
    <artifactId>powermock-module-junit4</artifactId>
    <version>2.0.9</version>
    <scope>test</scope>
</dependency>
```

### 2. Mock FeatureProbe Toggle

#### Target Method

```java
@AllArgsConstructor
@Service
public class DemoService {

    FeatureProbe fp;

    public boolean businessFunction(String userId, String tel) {
        FPUser fpUser = new FPUser(userId);
        fpUser.with("tel", tel);
        return fp.boolValue("is_tester", fpUser, false);
    }
}
```
#### Unit Test Code

```java
@RunWith(PowerMockRunner.class)
@PrepareForTest({FeatureProbe.class})
public class FeatureProbeTest {

    @Test
    public void test() {
        FeatureProbe fp = PowerMockito.mock(FeatureProbe.class);
        DemoService demoService = new DemoService(fp);
        Mockito.when(fp.boolValue(anyString(), any(FPUser.class), anyBoolean())).thenReturn(true);
        boolean tester = demoService.businessFunction("user123", "12397347232");
        assert tester;
    }

}
```