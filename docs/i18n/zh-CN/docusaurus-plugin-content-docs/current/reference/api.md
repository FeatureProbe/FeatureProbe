---
sidebar_position: 3
---

# OpenAPI

### Authentication

所有 REST API 资源访问使用[个人或应用 Access Token](#) 进行身份验证，不支持其他身份验证机制。 您可以在您的帐户设置页面上管理[个人 Access Token](#)。

您在平台上创建并获取到 Access Token 后，即可通过该 Token 来访问所有的 REST API ，访问时需要加上如下请求头参数：

| **Header**    | **Description**                 | E.g                                  |
| ------------- | ------------------------------- | ------------------------------------ |
| Authorization | 个人或应用 Access Token         | -H 'Authorization: API_ACCESS_TOKEN' |
| Content-Type  | 发送的数据协议类型，只支持 JSON | -H 'Content-Type: application/json'  |

所有对 API 的调用请使用 HTTPS 方式。



### Example

例如，通过如下请求来修改一个开关的人群规则:

```bash
curl -i 'https://featureprobe.io/api/projects/{PROJECT_KEY}/environments/{ENV_KEY}/toggles/{TOGGLE_KEY}/targeting' \
  -X 'PATCH' \
  -H 'Authorization: ${API_ACCESS_TOKEN}' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "comment":"test api change",
    "disabled": false,
    "content":{
        "rules":[
            {
                "name":"city",
                "serve":{
                    "select":0
                },
                "conditions":[
                    {
                        "type":"number",
                        "subject":"1",
                        "predicate":">",
                        "objects":[
                            "1000",
                            "1001"
                        ]
                    }
                ]
            }
        ],
        "disabledServe":{
            "select":0
        },
        "defaultServe":{
            "select":1
        },
        "variations":[
            {
                "value":"false",
                "name":"variation1",
                "description":""
            },
            {
                "value":"true",
                "name":"variation2",
                "description":""
            }
        ]
    }
}'
```



### OpenAPI Specification

您可以在此处找到我们的文档：[OpenAPI specification](https://featureprobe.io/api-docs)。