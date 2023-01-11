---
sidebar_position: 6
---

# 使用REST API发布开关

每一个FeatureProbe上的功能都是一个REST API，你可以通过REST API执行FeatureProbe 产品中的任何操作。

假定我们需要通过REST API实现如下场景:

- 对于『上海』的用户，显示『蓝色』按钮
- 对于『北京』的用户，50%的显示『蓝色』按钮，30%的显示『红色』按钮，20%的显示『绿色』按钮
- 其他城市的用户，全部显示『绿色』按钮

## 创建 Access Token

所有 REST API 资源访问使用 Access Token 进行身份验证，不支持其他身份验证机制。 

1、登录我们提供的FeatureProbe演示平台，如果是第一次登录，请输入邮箱。后续可以继续使用你的邮箱访问到属于你的数据。

2、点击页面顶部的 "租户设置"，然后选择左侧 "Access Tokens" ，点击`+ Token`开关新建一个Access Token。

* 填入名称
* 选择"Owner"角色
* 点击`创建`

![create tokken](/create_token.png)

3、复制保存TOKEN, Access Token创建成功后我们需要复制保存在TOKEN，后续将无法查看。

![create_success_token](/create_success_token.png)

## 创建一个开关

FeatureProbe  默认会创建一个 My_Project 的项目以及在该项目下一个 online 环境。
我们将演示在该项目下创建一个Color Button的开关来实现上面的功能。

:::tip
将下面命令中的 ${API_ACCESS_TOKEN}替换为上面保存的TOKEN
:::

```bash
curl -i 'https://featureprobe.io/api/projects/My_Project/toggles' \
  -X 'POST' \
  -H 'Authorization: ${API_ACCESS_TOKEN}' \
  -H 'Content-Type: application/json' \
  --data-raw '{
      "name": "Color Button",
      "key": "color_button",
      "desc": "This is a color button toggle.",
      "tags": [],
      "clientAvailability": true,
      "returnType": "string",
      "variations": [{
            "value": "blue",
            "name": "蓝色按钮",
            "description": "将展示一个蓝色按钮"
        }, {
            "value": "red",
            "name": "红色按钮",
            "description": "将展示一个红色按钮"
        },
        {
            "value": "green",
            "name": "绿色按钮",
            "description": "将展示一个绿色按钮"
        }],
      "disabledServe": 0,
      "permanent": false
    }'
```

## 配置开关规则并使开关生效

默认创建开关会在环境下初始化一个没有任何规则的禁用开关，下面我们通过REST API来配置并使开关生效。

:::tip
将下面命令中的 ${API_ACCESS_TOKEN}替换为上面保存的TOKEN
:::

```bash
curl -i 'https://featureprobe.io/api/projects/My_Project/environments/online/toggles/color_button/targeting' \
  -X 'PATCH' \
  -H 'Authorization: ${API_ACCESS_TOKEN}' \
  -H 'Content-Type: application/json' \
  --data-raw '{
	"comment": "按城市显示不同颜色按钮",
	"disabled": false,
	"content": {
		"rules": [{
			"name": "",
			"serve": {
				"select": 0
			},
			"conditions": [{
				"type": "string",
				"subject": "city",
				"predicate": "is one of",
				"objects": ["上海"]
			}]
		}, {
			"name": "",
			"serve": {
				"split": [5000, 3000, 2000]
			},
			"conditions": [{
				"type": "string",
				"subject": "city",
				"predicate": "is one of",
				"objects": ["北京"]
			}]
		}],
		"disabledServe": {
			"select": 0
		},
		"defaultServe": {
			"select": 2
		},
		"variations": [{
			"value": "blue",
			"name": "蓝色按钮",
			"description": "将展示一个蓝色按钮"
		}, {
			"value": "red",
			"name": "红色按钮",
			"description": "将展示一个红色按钮"
		}, {
			"value": "green",
			"name": "绿色按钮",
			"description": "将展示一个绿色按钮"
		}]
	}
}'
```

## SDK 接入开关验证效果

- 开关返回 "blue" 我们将为用户展示蓝色按钮。
- 开关返回 "red" 我们将为用户展示红色按钮。
- 开关返回 "green" 我们将为用户展示绿色按钮。

