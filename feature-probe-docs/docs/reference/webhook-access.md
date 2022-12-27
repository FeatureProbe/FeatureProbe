---
sidebar_position: 6
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Webhook Access

By configuring webhook, you can push the event data of FeatureProbe platform to your server.
Webhook is an http request callback interface. Your team needs to provide the implementation in the following ways.
When an event occurs on the FeatureProbe platform, it will call back the interface and push the event data to your server in json format.

## Configure Webhook

How to configure Webhook on the FeatureProbe platform. [Configure Webhook](../how-to/platform/webhooks.md)

## Access Webhook


### Request Method

support http/https POST Method

### Request Header

```text
Content-Type: application/json; charset=utf-8 
User-Agent: FeatureProbe-Webhook/1.0
X-FeatureProbe-Sign: xxxxxxxxxxxxxxx
```

### Request Body

* General structure

```json
{
  "action": "PUBLISH",
  "operator": "jianggang@featureprobe.com",
  "projectKey": "My_Project",
  "resource": "TOGGLE",
  "toggleKey": "Demo",
  "environmentKey": "online",
  "segmentKey": "online",
  "timestamp": 1669360165044,
  "data": {}
}
```

* Field description


| Field             | Description        |
|----------------|-----------------|
| resource       | event entity          |
| action         | event type            |
| operator       | Person triggered by the event  |
| timestamp      | Time of the event     |


* All events of the FeatureProbe platform Webhook are as follows:

| entity      | event                 |  resource                      | action                   |
|---------|--------------------|-------------------------------|--------------------------|
| project      | [create](#create-project)        | PROJECT           | CREATE                   |
|         | [update](#update-project)        | PROJECT    | UPDATE                   |
|         | [delete](#delete-project)        | PROJECT      | DELETE                   |
|         | [update approval settings](#update-approval-settings) | PROJECT  | UPDATE_APPROVAL_SETTINGS |
| environment      | [create](#create-environment)        | ENVIRONMENT     | CREATE                   |
|         | [update](#update-environment)        | ENVIRONMENT     | UPDATE                   |
|         | [offline](#offline-environment)        | ENVIRONMENT    | OFFLINE                  |
|         | [restore](#restore-environment)        | ENVIRONMENT     | RESTORE                  |
| segment      | [create](#create-segment)        | SEGMENT     | CREATE                   |
|         | [update](#update-segment)        |   SEGMENT  | UPDATE                   |
|         | [publish](#publish-segment)        | SEGMENT    | PUBLISH                  |
|         | [delete](#delete-segment)        | SEGMENT     | DELETE                   |
| toggle      | [create](#create-toggle)        | TOGGLE     | CREATE                   |
|         | [update](#update-toggle)                  |    TOGGLE   | UPDATE                   |
|         | [publish](#publish-toggle)                 |    TOGGLE  | PUBLISH                  |
|         | [offline](#offline-toggle)                 |    TOGGLE   | OFFLINE                  |
|         | [restore](#restore-toggle)                 |   TOGGLE    | RESTORE                  |
|         | [approval](#approval-toggle)               |    TOGGLE | CREATE_APPROVAL          |
|         | [update approval](#update-approval-toggle)            | TOGGLE  | UPDATE_APPROVAL                         |
| member      | [create](#create-member)                 | MEMBER     | CREATE |
|         | [update](#update-member)                  | MEMBER     | UPDATE |
|         | [delete](#delete-member)                  | MEMBER      | DELETE |
| webhook | [create](#create-webhook)                 | WEBHOOK | CREATE |
|         | [update](#update-webhook)                 | WEBHOOK | UPDATE |
|         | [delete](#delete-webhook)                 | WEBHOOK | DELETE |


### Validate Webhook Request（Optional）

FeaturePobe Webhook provides a security authentication method to prevent request forgery (CSRF attack).
When the FeaturePobe server pushes data, it will use the Secret Key to sha1 sign the request body data and place the signature in the request header X-FeatureProbe Sign,The same algorithm can be used to calculate the sign during docking, and the two must be consistent.


#### Signature Reference

<Tabs groupId="language">
<TabItem value="java" label="Java" default>

~~~java
public String sign(String secretKey, String requestBody) {
        try {
        SecretKeySpec signinKey = new SecretKeySpec(secretKey.getBytes(), "HmacSHA1");
        Mac mac = Mac.getInstance("HmacSHA1");
        mac.init(signinKey);
        byte[] rawHmac = mac.doFinal(requestBody.getBytes("UTF8"));
        return Base64.getEncoder().encodeToString(rawHmac);
        } catch (Exception e) {
        throw new RuntimeException(e);
        }
}
~~~

</TabItem>
<TabItem value="php" label="Php">

~~~php
function getSignature($secretKey, $content) {
    return base64_encode(hash_hmac("sha1", $content, $secretKey, true));
}
~~~

</TabItem>
<TabItem value="go" label="Go">

~~~go 
func sign(secretKey string, content string) string{
   key := []byte(secretKey)
   mac := hmac.New(sha1.New, key)
   mac.Write([]byte(content))
   res := base64.StdEncoding.EncodeToString(mac.Sum(nil))
   return res
}
~~~

</TabItem>
</Tabs>

## How to determine callback results

FeaturePorbe Webhook thinks that the response code between [200~300] is a success, and the others are failures.

## All event Request Body

### Project

#### Create Project
```json
{
 "action": "CREATE",
 "data": {
  "description": "",
  "environments": [{
   "clientSdkKey": "client-965ddabdca5dd390ac9a0398bfb1debce72573c6",
   "enableApproval": false,
   "key": "online",
   "name": "online",
   "serverSdkKey": "server-98848ff59b3278193c0b0bd07a6f3c60b9f69252"
  }],
  "key": "Test",
  "name": "Test"
 },
 "operator": "test@featureprobe.com",
 "resource": "PROJECT",
 "timestamp": 1669342189510
}
```

#### Update Project
```json
{
 "action": "UPDATE",
 "data": {
  "description": "",
  "environments": [{
   "clientSdkKey": "client-965ddabdca5dd390ac9a0398bfb1debce72573c6",
   "enableApproval": false,
   "key": "online",
   "name": "online",
   "serverSdkKey": "server-98848ff59b3278193c0b0bd07a6f3c60b9f69252"
  }],
  "key": "Test",
  "name": "Demo"
 },
 "operator": "test@featureprobe.com",
 "projectKey": "Test",
 "resource": "PROJECT",
 "timestamp": 1669342296378
}
```

#### DELETE Project
```json
{
 "action": "DELETE",
 "data": {
  "description": "",
  "environments": [{
   "clientSdkKey": "client-965ddabdca5dd390ac9a0398bfb1debce72573c6",
   "enableApproval": false,
   "key": "online",
   "name": "online",
   "serverSdkKey": "server-98848ff59b3278193c0b0bd07a6f3c60b9f69252"
  }],
  "key": "Test",
  "name": "Demo"
 },
 "operator": "jianggang@featureprobe.com",
 "projectKey": "Test",
 "resource": "PROJECT",
 "timestamp": 1669342345254
}
```

#### Update Approval Settings
```json
{
 "action": "UPDATE_APPROVAL_SETTINGS",
 "data": [{
  "enable": true,
  "environmentKey": "bbb",
  "environmentName": "bbbb",
  "locked": false,
  "reviewers": ["jianggang@featureprobe.com"]
 }, {
  "enable": false,
  "environmentKey": "online",
  "environmentName": "online",
  "locked": false,
  "reviewers": ["jianggang@featureprobe.com"]
 }],
 "operator": "jianggang@featureprobe.com",
 "projectKey": "My_Project",
 "resource": "PROJECT",
 "timestamp": 1669342480539
}
```

### Environment

#### Create Environment
```json
{
 "action": "CREATE",
 "data": {
  "clientSdkKey": "client-b74b8525e286391982bfdf1b8ba82cc1a7102faf",
  "enableApproval": false,
  "key": "stage",
  "name": "stage",
  "serverSdkKey": "server-5a664086d9350b4ec85c9b307eb1ccf531c7d862"
 },
 "operator": "jianggang@featureprobe.com",
 "projectKey": "My_Project",
 "resource": "ENVIRONMENT",
 "timestamp": 1669342539671
}
```

#### Update Environment
```json
{
 "action": "UPDATE",
 "data": {
  "clientSdkKey": "client-b74b8525e286391982bfdf1b8ba82cc1a7102faf",
  "enableApproval": false,
  "key": "stage",
  "name": "stage test",
  "serverSdkKey": "server-5a664086d9350b4ec85c9b307eb1ccf531c7d862"
 },
 "environmentKey": "stage",
 "operator": "jianggang@featureprobe.com",
 "projectKey": "My_Project",
 "resource": "ENVIRONMENT",
 "timestamp": 1669342620464
}
```

#### Offline Environment
```json
{
 "action": "OFFLINE",
 "data": {
  "clientSdkKey": "client-b74b8525e286391982bfdf1b8ba82cc1a7102faf",
  "enableApproval": false,
  "key": "stage",
  "name": "stage test",
  "serverSdkKey": "server-5a664086d9350b4ec85c9b307eb1ccf531c7d862"
 },
 "environmentKey": "stage",
 "operator": "jianggang@featureprobe.com",
 "projectKey": "My_Project",
 "resource": "ENVIRONMENT",
 "timestamp": 1669342656893
}
```

#### Restore Environment
```json
{
 "action": "RESTORE",
 "data": {
  "clientSdkKey": "client-b74b8525e286391982bfdf1b8ba82cc1a7102faf",
  "enableApproval": false,
  "key": "stage",
  "name": "stage test",
  "serverSdkKey": "server-5a664086d9350b4ec85c9b307eb1ccf531c7d862"
 },
 "environmentKey": "stage",
 "operator": "jianggang@featureprobe.com",
 "projectKey": "My_Project",
 "resource": "ENVIRONMENT",
 "timestamp": 1669342694978
}
```

### Segment

#### Create Segment
```json
{
 "action": "CREATE",
 "data": {
  "createdTime": 1669342753382,
  "description": "",
  "key": "Test",
  "modifiedBy": "jianggang@featureprobe.com",
  "modifiedTime": 1669342753382,
  "name": "Test",
  "projectKey": "My_Project",
  "rules": []
 },
 "operator": "jianggang@featureprobe.com",
 "resource": "SEGMENT",
 "timestamp": 1669342752617
}
```

#### Update Segment
```json
{
 "action": "UPDATE",
 "data": {
  "createdTime": 1669342753000,
  "description": "",
  "key": "Test",
  "modifiedBy": "jianggang@featureprobe.com",
  "modifiedTime": 1669342753000,
  "name": "Demo",
  "projectKey": "My_Project",
  "rules": []
 },
 "operator": "jianggang@featureprobe.com",
 "resource": "SEGMENT",
 "timestamp": 1669342849844
}
```

#### Publish Segment
```json
{
 "action": "PUBLISH",
 "data": {
  "createdTime": 1669342753000,
  "description": "",
  "key": "Test",
  "modifiedBy": "jianggang@featureprobe.com",
  "modifiedTime": 1669342898961,
  "name": "Demo",
  "projectKey": "My_Project",
  "rules": [{
   "conditions": [{
    "objects": ["TEST"],
    "predicate": "is one of",
    "subject": "name",
    "type": "string"
   }],
   "name": ""
  }]
 },
 "operator": "jianggang@featureprobe.com",
 "resource": "SEGMENT",
 "timestamp": 1669342898814
}
```

#### Delete Segment
```json
{
 "action": "DELETE",
 "data": {
  "createdTime": 1669342753000,
  "description": "",
  "key": "Test",
  "modifiedBy": "jianggang@featureprobe.com",
  "modifiedTime": 1669342936447,
  "name": "Demo",
  "projectKey": "My_Project",
  "rules": [{
   "conditions": [{
    "objects": ["TEST"],
    "predicate": "is one of",
    "subject": "name",
    "type": "string"
   }],
   "name": ""
  }]
 },
 "operator": "jianggang@featureprobe.com",
 "resource": "SEGMENT",
 "timestamp": 1669342936153
}
```

### Toggle

#### Create Toggle
```json
{
 "action": "CREATE",
 "data": {
  "archived": false,
  "clientAvailability": false,
  "createdTime": 1669342980446,
  "desc": "",
  "disabledServe": 0,
  "key": "Test",
  "modifiedBy": "jianggang@featureprobe.com",
  "modifiedTime": 1669342980446,
  "name": "Test",
  "permanent": false,
  "returnType": "boolean",
  "tags": ["test"],
  "variations": [{
   "description": "",
   "name": "variation1",
   "value": "false"
  }, {
   "description": "",
   "name": "variation2",
   "value": "true"
  }]
 },
 "operator": "jianggang@featureprobe.com",
 "resource": "TOGGLE",
 "timestamp": 1669342980174
}
```

#### Update Toggle
```json
{
 "action": "UPDATE",
 "data": {
  "archived": false,
  "clientAvailability": true,
  "createdTime": 1669344216000,
  "desc": "",
  "disabledServe": 0,
  "key": "Demo",
  "modifiedBy": "jianggang@featureprobe.com",
  "modifiedTime": 1669344216000,
  "name": "Demo",
  "permanent": false,
  "returnType": "boolean",
  "tags": [],
  "variations": [{
   "description": "",
   "name": "variation1",
   "value": "false"
  }, {
   "description": "",
   "name": "variation2",
   "value": "true"
  }]
 },
 "operator": "jianggang@featureprobe.com",
 "resource": "TOGGLE",
 "timestamp": 1669360035636
}
```

#### Publish Toggle
```json
{
 "action": "PUBLISH",
 "data": {
  "content": {
   "defaultServe": {
    "select": 1
   },
   "disabledServe": {
    "select": 0
   },
   "rules": [],
   "variations": [{
    "description": "",
    "name": "variation1",
    "value": "false"
   }, {
    "description": "",
    "name": "variation2",
    "value": "true"
   }]
  },
  "disabled": false,
  "enableApproval": false,
  "locked": false,
  "modifiedBy": "jianggang@featureprobe.com",
  "modifiedTime": 1669360165284,
  "publishTime": 1669360165273,
  "status": "RELEASE",
  "version": 2
 },
 "environmentKey": "online",
 "operator": "jianggang@featureprobe.com",
 "projectKey": "My_Project",
 "resource": "TOGGLE",
 "timestamp": 1669360165044,
 "toggleKey": "Demo"
}
```

#### Offline Toggle
```json
{
 "action": "OFFLINE",
 "data": {
  "archived": true,
  "clientAvailability": true,
  "createdTime": 1669344216000,
  "desc": "",
  "disabledServe": 0,
  "key": "Demo",
  "modifiedBy": "jianggang@featureprobe.com",
  "modifiedTime": 1669360035000,
  "name": "Demo",
  "permanent": false,
  "returnType": "boolean",
  "tags": [],
  "variations": [{
   "description": "",
   "name": "variation1",
   "value": "false"
  }, {
   "description": "",
   "name": "variation2",
   "value": "true"
  }]
 },
 "operator": "jianggang@featureprobe.com",
 "resource": "TOGGLE",
 "timestamp": 1669360204523
}
```

#### Restore Toggle
```json
{
 "action": "RESTORE",
 "data": {
  "archived": false,
  "clientAvailability": true,
  "createdTime": 1669344216000,
  "desc": "",
  "disabledServe": 0,
  "key": "Demo",
  "modifiedBy": "jianggang@featureprobe.com",
  "modifiedTime": 1669360204000,
  "name": "Demo",
  "permanent": false,
  "returnType": "boolean",
  "tags": [],
  "variations": [{
   "description": "",
   "name": "variation1",
   "value": "false"
  }, {
   "description": "",
   "name": "variation2",
   "value": "true"
  }]
 },
 "operator": "jianggang@featureprobe.com",
 "resource": "TOGGLE",
 "timestamp": 1669360239018
}
```

#### Approval Toggle
```json
{
 "action": "CREATE_APPROVAL",
 "data": {
  "approvalData": {
   "content": "{"rules":[],"disabledServe":{"select":0},"defaultServe":{"select":1},"variations":[{"value":"false","name":"variation1","description":""},{"value":"true","name":"variation2","description":""}]}",
   "disabled": true
  },
  "approvalDate": 1669370201286,
  "currentData": {
   "content": "{"rules":[],"disabledServe":{"select":0},"defaultServe":{"select":1},"variations":[{"value":"false","name":"variation1","description":""},{"value":"true","name":"variation2","description":""}]}",
   "disabled": false
  },
  "environmentKey": "online",
  "projectKey": "My_Project",
  "status": "PENDING",
  "submitBy": "jianggang@featureprobe.com",
  "toggleKey": "Demo"
 },
 "environmentKey": "online",
 "operator": "jianggang@featureprobe.com",
 "projectKey": "My_Project",
 "resource": "TOGGLE",
 "timestamp": 1669370200888,
 "toggleKey": "Demo"
}
```

####  Update Approval Toggle
```json
{
 "action": "UPDATE_APPROVAL",
 "data": {
  "approvalData": {
   "content": "{"rules":[],"disabledServe":{"select":0},"defaultServe":{"select":1},"variations":[{"value":"false","name":"variation1","description":""},{"value":"true","name":"variation2","description":""}]}",
   "disabled": true
  },
  "approvalDate": 1669370291876,
  "currentData": {
   "content": "{"rules":[],"disabledServe":{"select":0},"defaultServe":{"select":1},"variations":[{"value":"false","name":"variation1","description":""},{"value":"true","name":"variation2","description":""}]}",
   "disabled": false
  },
  "environmentKey": "online",
  "projectKey": "My_Project",
  "status": "REVOKE",
  "submitBy": "jianggang@featureprobe.com",
  "toggleKey": "Demo"
 },
 "environmentKey": "online",
 "operator": "jianggang@featureprobe.com",
 "projectKey": "My_Project",
 "resource": "TOGGLE",
 "timestamp": 1669370291596,
 "toggleKey": "Demo"
}
```

### Member

#### Create Member
```json
{
 "action": "CREATE",
 "data": [{
  "account": "test@test.com",
  "createdBy": "jianggang@featureprobe.com",
  "createdTime": 1669360591619,
  "modifiedBy": "jianggang@featureprobe.com",
  "modifiedTime": 1669360591619,
  "role": "WRITER"
 }],
 "operator": "jianggang@featureprobe.com",
 "resource": "MEMBER",
 "timestamp": 1669360591287
}
```

#### Update Member
```json
{
 "action": "UPDATE",
 "data": {
  "account": "test@test.com",
  "createdBy": "jianggang@featureprobe.com",
  "createdTime": 1669360591000,
  "modifiedBy": "jianggang@featureprobe.com",
  "modifiedTime": 1669360591000,
  "role": "OWNER"
 },
 "operator": "jianggang@featureprobe.com",
 "resource": "MEMBER",
 "timestamp": 1669360630120
}
```

#### Delete Member
```json
{
 "action": "DELETE",
 "data": {
  "account": "test@test.com",
  "createdBy": "jianggang@featureprobe.com",
  "createdTime": 1669360591000,
  "modifiedBy": "jianggang@featureprobe.com",
  "modifiedTime": 1669360630000,
 },
 "operator": "jianggang@featureprobe.com",
 "resource": "MEMBER",
 "timestamp": 1669361086817
}
```

### Webhook

#### Create Webhook
```json
{
 "action": "CREATE",
 "data": {
  "createdBy": "jianggang@featureprobe.com",
  "createdTime": 1669363048466,
  "description": "This a test webhook",
  "id": 37,
  "modifiedBy": "jianggang@featureprobe.com",
  "modifiedTime": 1669363048466,
  "name": "Test",
  "status": "ENABLE",
  "url": "http://127.0.0.1"
 },
 "operator": "jianggang@featureprobe.com",
 "resource": "WEBHOOK",
 "timestamp": 1669363048390
}
```

#### Update Webhook
```json
{
 "action": "UPDATE",
 "data": {
  "createdBy": "jianggang@featureprobe.com",
  "createdTime": 1669363048000,
  "description": "This a test webhook",
  "id": 37,
  "modifiedBy": "Admin",
  "modifiedTime": 1669363050000,
  "name": "Test",
  "status": "ENABLE",
  "url": "http://127.0.0.1/demo"
 },
 "operator": "jianggang@featureprobe.com",
 "resource": "WEBHOOK",
 "timestamp": 1669363075138
}
```

#### Delete Webhook
```json
{
  "action": "DELETE",
  "data": {
    "createdBy": "jianggang@featureprobe.com",
    "createdTime": 1669363048000,
    "description": "This a test webhook",
    "id": 37,
    "modifiedBy": "Admin",
    "modifiedTime": 1669363077000,
    "name": "Test",
    "status": "ENABLE",
    "url": "http://127.0.0.1/demo"
  },
  "operator": "jianggang@featureprobe.com",
  "resource": "WEBHOOK",
  "timestamp": 1669363176546
}
```




