---
sidebar_position: 6
---

# 使用OpenAPI发布开关

每一个FeatureProbe上的功能都是一个REST API，你可以通过REST API执行FeatureProbe 产品中的任何操作。
了解所有REST API请阅读[API 文档](https://featureprobe.io/api-docs)。

## 概述

本文档将说明如何对FeatureProbe REST API 进行鉴权以及通过 REST API 发布开关。

## 鉴权

所有 REST API 资源访问使用[个人或应用 Access Token](/how-to/platform/token) 进行身份验证，不支持其他身份验证机制。 
您可以在您的帐户设置页面上管理[个人 Access Token](/how-to/platform/token#个人tokens)。

您在平台上创建并获取到 Access Token 后，即可通过该 Token 来访问所有的 REST API ，访问时需要加上如下请求头参数：

| **Header**    | **Description**                 | E.g                                  |
| ------------- | ------------------------------- | ------------------------------------ |
| Authorization | 个人或应用 Access Token         | -H 'Authorization: API_ACCESS_TOKEN' |
| Content-Type  | 发送的数据协议类型，只支持 JSON | -H 'Content-Type: application/json'  |

## 开关发布

### 第一步: 创建一个项目 （如已有选择跳过）

项目是开关的集合，我们推荐按实际业务的服务（微服务）粒度来创建对应的项目。如果选择一个平台已有的项目可跳过这步。
创建项目后，项目下默认会创建一个online的环境。

创建一个新的项目：[RUST API](https://featureprobe.io/api-docs#tag/Projects/operation/create_2)

#### Example

```bash
curl -i 'https://featureprobe.io/api/projects' \
  -X 'POST' \
  -H 'Authorization: ${API_ACCESS_TOKEN}' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "name": "Test Project",
    "key": "test_project",
    "description": "This is a test project."
    }'
```

#### 参数说明

| **key**       | **Type**    | **Optional** | **Description** | Notice |
|---------------|-------------|-------------|-----------------|--------|
| name | string      | true        | 一个人类友好的名称       | 全局唯一   |
| key  | string      | true        | 唯一KEY           | 全局唯一            |
| description  | string| false       | 描述信息            | -               |


### 第二步: 在项目下创建并发布一个开关 （如已有选择跳过）

开关是功能的管理实体。开关属于某个项目，开关创建后，会在项目的所有环境中都初始化一个禁用状态的开关。

在指定项目下创建一个新的开关：[RUST API](https://featureprobe.io/api-docs#tag/Toggles/operation/create_3)

#### Example

```bash
curl -i 'https://featureprobe.io/api/projects/{projectKey}/toggles' \
  -X 'POST' \
  -H 'Authorization: ${API_ACCESS_TOKEN}' \
  -H 'Content-Type: application/json' \
  --data-raw '{
      "name": "Test Toggle",
      "key": "test_toggle",
      "desc": "This is a test toggle.",
      "tags": [
        "test"
      ],
      "clientAvailability": true,
      "returnType": "boolean",
      "variations": [{
            "value": "false",
            "name": "Close",
            "description": "Close feature"
        }, {
            "value": "true",
            "name": "Open",
            "description": "Open feature"
        }],
      "disabledServe": 0,
      "permanent": false
    }'
```

#### 参数说明

PATH PARAMETERS

| **key**       | **Type** | **Optional**  | **Description** | Notice |
|---------------|----------|---------------|-----------------|--------|
| projectKey | string   | true | 项目的唯一KEY        | 开关所在项目           |

REQUEST BODY

| **key**       | **Type**            | **Optional**     | **Description**         | Notice |
|--------------------|---------------------|------------------|-------------------------|---------------------------------------------------------------------------------|
| name               | string              | true             | 一个对人类友好的名称              | 项目下唯一                                                                           |
| key                | string              | true             | 唯一KEY                   | 项目下唯一                                                                             |
| desc               | string              | false            | 描述信息                    | -                                                                                 |
| tags               | array               | false            | 为开关打一些标签                | -                                                                                 |
| clientAvailability | boolean             | true             | 该开关是否有client端接入         | 如果client端需要接入，需要设置为true                                                           |
| returnType         | string              | true             | 返回类型决定了代码中开关的返回值类型      | 可选值： "boolean" "number" "string" "json"                                           |
| variations         | array               | true             | 定义开关可选的值                | 当 returnType 为 "boolean"时，可选的值只能为 true 和 false， 其他类型数量不限制，但需要注意值格式必须和returnType相符 |
| disabledServe      | int                 | true             | 选择在开关未生效时，返回的分组索引，下标0开始 | 创建并发布开关默认开关是禁用状态 ，这里定义开关禁用状态的返回值 |                    |                                                             |
| permanent          | boolean | true | 定义开关是否为永久开关             | 开关治理的标记 非永久开关使用30天后会在平台提示清理  |


### 第三步: 修改开关配置，并发布

开关的“配置信息”环境间隔离，互不影响。

发布指定环境开关配置：[RUST API](https://featureprobe.io/api-docs#tag/Targeting/operation/publish_1)

#### Example

```bash
curl -i 'https://featureprobe.io/api/projects/{projectKey}/environments/{environmentKey}/toggles/{toggleKey}/targeting' \
  -X 'PATCH' \
  -H 'Authorization: ${API_ACCESS_TOKEN}' \
  -H 'Content-Type: application/json' \
  --data-raw '{
	"comment": "",
	"disabled": true,
	"content": {
		"rules": [{
		    "name": "rule 1",
			"conditions": [{
				"type": "string",
				"subject": "userId",
				"predicate": "is one of",
				"objects": ["100000", "1000001"]
			}, {
				"type": "string",
				"subject": "city",
				"predicate": "is one of",
				"objects": ["beijing"]
			}],
			"serve": {
				"select": 1
			}
		}, {
		    "name": "rule 2",
			"conditions": [{
				"type": "string",
				"subject": "city",
				"predicate": "is one of",
				"objects": ["shanghai"]
			}],
			"serve": {
				"split": [5000, 5000]
			}
		}],
		"disabledServe": {
			"select": 0
		},
		"defaultServe": {
			"select": 0
		},
		"variations": [{
			"value": "false",
			"name": "Close",
			"description": "Close Feature"
		}, {
			"value": "true",
			"name": "Open",
			"description": "Open Feature"
		}]
	}
}'
```

#### 参数说明

PATH PARAMETERS

| **key**       | **Type**           | **Optional**     | **Description** | Notice |
|---------------|--------------------|------------------|-----------------|--------|
| projectKey | string             | true             | 项目的唯一KEY        | 开关所在项目 |
| environmentKey | string             | true             | 项目下环境的唯一KEY     | 开关所在环境 |
| toggleKey | string | true | 项目下开关的唯一KEY     | -                 |

REQUEST BODY

| **key**       | **Type**                          | **Optional**                    | **Description**         | Notice |
|---------------|-----------------------------------|---------------------------------|-------------------------|--------|
| content               | object                            | true                            | 开关配置内容                  | -      |
| comment                | string                            | true                            | Release Note            | -            |
| disabled               | string | true | 开关是否禁用 | true：禁用， false：启用                 |

- 开关配置内容content字段说明

| **key**       | **Type**      | **Optional** | **Description**   | Notice                                     |
|--------------------|---------------|--------------|-------------------|--------------------------------------------|
| variations               | array         | true         | 开关分组（定义开关可选的值）    | -                                          |
| rules                | array         | true         | 开关规则集             | 无规则则为空集合 [ ] ，规则之前关系为 "OR"                 |
| defaultServe               | object | true | 开关默认规则返回分组        | 当上面所有规则都没命中时命中该规则，支持指定具体的分组下标或百分比对所有分组进行放量 |
| disabledServe               | object        | true         | 选择在开关未生效时，返回的分组索引 | 只能选择一个具体的分组的下标 ,下标从0开始                     |

- 配置内容rules字段说明

| **key**       | **Type**      | **Optional** | **Description** | Notice                  |
|--------------------|---------------|--------------|-----------------|-------------------------|
| name               | string        | false        | 规则的名称           | -                       |
| conditions                | array         | true         | 开关规则集           | 至少添加一条规则 ,规则之间关系为 "AND" |
| serve               | object | true | 开关默认规则          | 当上面所有规则都没命中时命中该规则，支持指定具体的分组下标和或百分比对所有分组进行放量 |

- 配置内容规则conditions字段说明

| **key**       | **Type** | **Optional** | **Description** | Notice                                                                                                                                                                                                                                                                                      |
|--------------------|----------|--------------|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type               | string   | true        | 条件类型            | 可选值："string" "number" "semver" "datetime"                                                                                                                                                                                                                                                   |
| subject                | string   | true         | user的属性名        | -                                                                                                                                                                                                                                                                                           |
| predicate               | string   | true | 条件的匹配规则         | string类型可选规则： 'is one of', 'ends with', 'starts with', 'contains', 'matches regex', 'is not any of', 'does not end with', 'does not start with', 'does not contain', 'does not match regex' <br/> number和semver类型可选规则: '=', '!=', '>', '>=', '<', '<=' <br/>datetime类型可选规则： 'after', 'before' |
| objects               | array    | true | 目标用户匹配属性值          | 值的数据类型需要和type类型相符                                                                                                                                                                                                                                                                           |


- 配置规则命中返回serve字段说明

| **key**       | **Type** | **Optional** | **Description**  | Notice                                         |
|--------------------|----------|--------------|------------------|------------------------------------------------|
| select               | int      | false        | 规则命中时，返回的分组索引    |                                                |
| split                | array    | false        | 规则命中事，按百分比放量所有分组 | 数据精度为：10000 <br/> 例子：比如两个分组各50%放量 [5000, 5000] |


:::tip
select 和 split 只能选择其中一个
:::
