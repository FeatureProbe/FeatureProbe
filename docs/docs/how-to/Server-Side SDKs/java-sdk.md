---
sidebar_position: 1
---

# Java SDK

FeatureProbe is an open source feature management service. This SDK is used to control features in java programs. This SDK is designed primarily for use in multi-user systems such as web servers and applications.

:::note SDK quick links

In addition to this reference guide, we provide source code, API reference documentation, and sample applications at the following links:

| **Resource**        | **Location** |
| --------------------------------------- | ----------------- |
| SDK API documentation | [ SDK API docs](https://featureprobe.github.io/server-sdk-java/) |
| GitHub repository | [Server-SDK for Java](https://github.com/FeatureProbe/server-sdk-java) |
| Sample applications | [FeatureProbeDemo](https://github.com/FeatureProbe/server-sdk-java/blob/main/src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java) (Java) |
|Published module|[Maven](https://mvnrepository.com/artifact/com.featureprobe/server-sdk-java)|

:::

:::tip
For users who are using FeatureProbe for the first time, we strongly recommend that you return to this article to continue reading after reading the [Gradual Rollout Tutorial](../../tutorials/rollout_tutorial/).
:::

## Step-by-Step Guide

Backend projects usually only need to instantiate a FeatureProbe SDK (Client).

According to the requests of different users, call the FeatureProbe Client to obtain the toggle result for each user.

:::info
The server-side SDK uses an asynchronous connection to the FeatureProbe server to pull judgment rules, and the judgment rules will be cached locally. All interfaces exposed to user code only involve memory operations, so there is no need to worry about performance issues when calling.
:::

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
  
  	if（!fpClient.initialized()) {
				System.out.println("SDK failed to initialize!")
		}
}
```

### Step 3. Use the feature toggle

You can use sdk to check which variation a particular user will receive for a given feature flag.

```java
FPUser user = new FPUser();
    user.with("ATTRIBUTE_NAME_IN_RULE", VALUE_OF_ATTRIBUTE);    // Call with() for each attribute used in Rule.
    boolean boolValue = fpClient.boolValue("YOUR_TOGGLE_KEY", user, false);
    if (boolValue) {
    // the code to run if the toggle is on
    } else {
    // the code to run if the toggle is off
    }
```

### Step 4. Close FeatureProbe Client before program exits

Close the client before exiting to ensure accurate data reporting.

```java
fpClient.close();
```

## Track Events

:::note
The Java SDK supports event tracking from version 2.0.1.
:::


The event tracking feature can record the actions taken by the user in the application as events.

Events are related to toggle's metrics. For more information about event analysis, please read [Event Analysis](../../tutorials/analysis).

```java
fpClient.track("YOUR_CUSTOM_EVENT_NAME", user);
// Providing a metric value to track
fpClient.track("YOUR_CUSTOM_EVENT_NAME", user, 5.5);
```

## Mock FeatureProbe for Unit test

You can mock FeatureProbe SDK returned value, to run unit test of your code.

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

## Customize SDK

:::tip
This paragraph applies to users who want to customize this SDK, or contribute code to this SDK through the open source community. Other users can skip this section.
:::

We provide an acceptance test of this SDK to ensure that the modified SDK is compatible with the native rules of FeatureProbe.
Integration test cases are added as submodules of each SDK repository. So be sure to pull the submodule first to get the latest integration tests before running the tests.

```shell
git submodule update --init --recursive
mvn test
```
