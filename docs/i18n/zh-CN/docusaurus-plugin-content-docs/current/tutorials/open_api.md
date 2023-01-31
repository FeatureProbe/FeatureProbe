---
sidebar_position: 6
---

# 使用REST API发布开关

每一个FeatureProbe上的功能都是一个REST API，你可以通过REST API执行FeatureProbe 产品中的任何操作。

假定我们需要通过REST API实现如下场景:

- 创建一个新的开关
- 打开这个开关并发布

## 创建 Access Token

所有 REST API 资源访问使用 Access Token 进行身份验证，不支持其他身份验证机制。 

1、登录我们提供的FeatureProbe[演示平台](https://featureprobe.io)，如果是第一次登录，请输入邮箱。后续可以继续使用你的邮箱访问到属于你的数据。

2、点击页面顶部的 "租户设置"，然后选择左侧 "Access Tokens" ，点击`+ Token`开关新建一个Access Token。

* 填入名称
* 选择"Owner"角色
* 点击`创建`

![create tokken](/create_token.png)

3、复制保存TOKEN, Access Token创建成功后我们需要复制保存在TOKEN，后续将无法查看。

![create_success_token](/create_success_token.png)

## 创建一个开关

FeatureProbe  默认会创建一个 My_Project 的项目以及在该项目下一个 online 环境。
我们将演示在该项目下创建一个New Feature的开关

:::tip
将下面命令中的 ${API_ACCESS_TOKEN}替换为上面保存的TOKEN
:::

```bash
curl -i 'https://featureprobe.io/api/projects/My_Project/toggles' \
  -X 'POST' \
  -H 'Authorization: ${API_ACCESS_TOKEN}' \
  -H 'Content-Type: application/json' \
  --data-raw '{
      "name": "New Feature",
      "key": "new_feature",
      "desc": "This is a feature control toggle.",
      "tags": [],
      "clientAvailability": true,
      "returnType": "boolean",
      "variations": [{
            "value": "false",
            "name": "关闭",
            "description": "关闭新功能"
        }, {
            "value": "true",
            "name": "打开",
            "description": "打开新功能"
        }],
      "disabledServe": 0,
      "permanent": false
    }'
```

**验证是否创建成功**

![new_feature_toggle](/new_feature_toggle.png)

## 打开开关并发布

默认创建开关会在环境下初始化一个没有任何规则的禁用开关，下面我们通过REST API来打开这个开关。

:::tip
将下面命令中的 ${API_ACCESS_TOKEN}替换为上面保存的TOKEN
:::

```bash
curl -i 'https://featureprobe.io/api/projects/My_Project/environments/online/toggles/new_feature/targeting' \
  -X 'PATCH' \
  -H 'Authorization: ${API_ACCESS_TOKEN}' \
  -H 'Content-Type: application/json' \
  --data-raw '{
	"comment": "打开开关",
	"disabled": false,
	"content": {
		"defaultServe": {
			"select": 1
		}
	}
}'
```

**验证开关是否打开**

![open_new_feature_toggle](/open_new_feature_toggle.png)
