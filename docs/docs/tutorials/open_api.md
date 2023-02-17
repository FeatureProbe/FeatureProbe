---
sidebar_position: 6
---

# Publish toggle with REST API

Every FeatureProbe feature begins as an REST API. You can perform any operation in the FeatureProbe product through the REST API.

Suppose we need to implement the following scenarios through the REST API:

- Create a new toggle
- Open and publish this toggle

## Create Access Token

All REST API resource access uses Access Token for authentication, no other authentication mechanisms are supported.

1、Log in to the FeatureProbe [demo platform](https://featureprobe.io). If you log in for the first time, please enter your email address. You can continue to use your email to access your data in the future.

2、Click "Settings" at the top of the page，Then select "Access tokens" on the left ，Click `+ Token` button to create a new Access Token.

* Fill in the name.
* Select the "Owner" role.
* Click on `Create`.

![create tokken_en](/create_token_en.png)

3、Copy and save the TOKEN. After the Access Token is successfully created, we need to copy and save it in the TOKEN, which will not be viewable later.

![create_success_token_en](/create_success_token_en.png)

## Create Toggle

By default, FeatureProbe will create a My_Project project and an online environment under the project.
We will demonstrate to create a "New Feature" toggle under this project.

:::tip
Replace ${API_ACCESS_TOKEN} in the command below with the TOKEN saved above.
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
            "name": "Close",
            "description": "Close new feature."
        }, {
            "value": "true",
            "name": "Open",
            "description": "Open new feature."
        }],
      "disabledServe": 0,
      "permanent": false
    }'
```

**Whether the verification is successful**

![new_feature_toggle_en](/new_feature_toggle_en.png)

## Open and publish

The toggle creates a default disabled state.
Next, we will turn on this toggle through the REST API.

:::tip
Replace ${API_ACCESS_TOKEN} in the command below with the TOKEN saved above.
:::

```bash
curl -i 'https://featureprobe.io/api/projects/My_Project/environments/online/toggles/new_feature/targeting' \
  -X 'PATCH' \
  -H 'Authorization: ${API_ACCESS_TOKEN}' \
  -H 'Content-Type: application/json' \
  --data-raw '{
	"comment": "Open toggle.",
	"disabled": false,
	"content": {
		"defaultServe": {
			"select": 1
		}
	}
}'
```

**Whether the verification is successful**

![open_new_feature_toggle_en](/open_new_feature_toggle_en.png)
