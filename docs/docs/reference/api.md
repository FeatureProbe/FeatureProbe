---
sidebar_position: 10
---

# OpenAPI

### Authentication

All REST API resource access is authenticated using [Personal or Sharing Token](/how-to/platform/token), no other authentication mechanisms are supported. You can manage your [Personal Access Token](/how-to/platform/token#personal-tokens) on your account settings page.

After you create and obtain an Access Token on the platform, you can use this Token to access all REST APIs, and you need to add the following request header parameters when accessing:

| **Header** | **Description** | E.g |
| ------------- | ------------------------------- | --- ------------------------------------ |
| Authorization | Personal or Application Access Token | -H 'Authorization: API_ACCESS_TOKEN' |
| Content-Type | The protocol type of data sent, only JSON is supported | -H 'Content-Type: application/json' |

Please use HTTPS for all calls to the API.

### Example

For example, modify a toggle's crowd rules with the following request:

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

We use the REST specification with OpenAPI, you can find our documentation here: [FeatureProbe OpenAPI](https://featureprobe.io/api-docs)。.

