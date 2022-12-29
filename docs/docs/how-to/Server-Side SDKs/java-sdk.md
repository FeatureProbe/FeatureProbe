---
sidebar_position: 1
---

# Java SDK

Feature Probe is an open source feature management service. This SDK is used to control features in java programs. This
SDK is designed primarily for use in multi-user systems such as web servers and applications.

## Try Out Demo Code

We provide a runnable [demo code](https://github.com/FeatureProbe/server-sdk-java/blob/main/src/main/java/com/featureprobe/sdk/example/) for you to understand how FeatureProbe SDK is used.

1. Select a FeatureProbe platform to connect to.
    * You can use our online demo environment [FeatureProbe Demo](https://featureprobe.io/login).
    * Or you can use docker composer to [set up your own FeatureProbe service](https://github.com/FeatureProbe/FeatureProbe#1-starting-featureprobe-service-with-docker-compose)

2. Download this repo:
```bash
git clone https://github.com/FeatureProbe/server-sdk-java.git
cd server-sdk-java
```
3. Find the Demo code in `src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java` change `FEATURE_PROBE_SERVER_URL` and
   `FEATURE_PROBE_SERVER_SDK_KEY` to match the platform you selected.
    * For online demo environment:
        * `FEATURE_PROBE_SERVER_URL` = "https://featureprobe.io/server"
        * `FEATURE_PROBE_SERVER_SDK_KEY` please copy from GUI:
          ![server_sdk_key snapshot](/server_sdk_key_en.png)
    * For docker environment:
        * `FEATURE_PROBE_SERVER_URL` = "http://YOUR_DOCKER_IP:4009/server"
        * `FEATURE_PROBE_SERVER_SDK_KEY` = "server-8ed48815ef044428826787e9a238b9c6a479f98c"

4. Run the program.
```bash
mvn package
java -jar ./target/server-sdk-java-1.4.0.jar
```

## Step-by-Step Guide

In this guide we explain how to use feature toggles in your own Java application using FeatureProbe.

### Step 1. Install the Java SDK

First, install the FeatureProbe SDK as a dependency in your application.

#### Apache Maven

```xml
<dependency>
    <groupId>com.featureprobe</groupId>
    <artifactId>server-sdk-java</artifactId>
    <version>1.4.0</version>
</dependency>
```

#### Gradle Groovy DSL

```text
implementation 'com.featureprobe:server-sdk-java:1.4.0'
```

### Step 2. Create a FeatureProbe instance

After you install and import the SDK, create a single, shared instance of the FeatureProbe sdk.

```java
public class Demo {
    private static final FPConfig config = FPConfig.builder()
            .remoteUri(/* FeatureProbe Server URI */)
            .build();

    private static final FeatureProbe fpClient = new FeatureProbe(
        /* FeatureProbe Server SDK Key */, config);
}
```

### Step 3. Use the feature toggle

You can use sdk to check which variation a particular user will receive for a given feature flag.

```java
FPUser user = new FPUser(/* uniqueUserId for percentage rollout */);
user.with("ATTRIBUTE_NAME_IN_RULE", VALUE_OF_ATTRIBUTE);    // Call with() for each attribute used in Rule.
boolean boolValue = fpClient.boolValue("YOUR_TOGGLE_KEY", user, false);
if (boolValue) {
   // the code to run if the toggle is on
} else {
   // the code to run if the toggle is off
}
```

## Test of this SDK

We have unified integration tests for all our SDKs. Integration test cases are added as submodules for each SDK repo. So
be sure to pull submodules first to get the latest integration tests before running tests.

```shell
git pull --recurse-submodules
mvn test
```

## Mock FeatureProbe for Unittest

You can mock FeatureProbe SDK returned value, to run unittest of your code.

### 1. Add powermock SDK to your project:

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

### 2. Mock Toggle

#### Target Method

```java
@AllArgsConstructor
@Service
public class DemoService {

    FeatureProbe fp;

    public boolean isTester(String userId, String tel) {
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
        boolean tester = demoService.isTester("user123", "12397347232");
        assert tester;
    }

}
```
