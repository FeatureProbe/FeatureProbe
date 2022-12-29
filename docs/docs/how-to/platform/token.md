---
sidebar_position: 8
---

# Open API Tokens

FeatureProbe provides 2 different Tokens (shared Tokens, personal Tokens) for accessing OpenAPI.
   - Shared Tokens: Shared tokens are not tied to individuals, cannot be changed once created, and are permanent.
   - Personal Tokens: Personal Token has the same permissions as the creator, and will change synchronously with the creator's permissions. If the creator is deleted, his Token will also become invalid.

## Sharing Tokens

![shared list](/shared_list_en.png)

### Create shared token
Anyone can create a shared Token, once created, it cannot be changed.
1. Fill in the name of the shared Token (the name is unique under the tenant)
2. Select a role (granting roles with more permissions than yourself is not supported)
3. Click the Create button to complete the creation of the shared Token.
4. After the creation is complete, you need to click "Copy Token" immediately, otherwise the Token will be hidden after leaving this page (if it is not saved in time, it is recommended to delete and create a new Token).

![shared create](/shared_create_en.png)

![shared copy](/shared_copy_en.png)

### Delete shared token
After the shared token is deleted, the shared token will become invalid.


## Personal Tokens

![personal list](/personal_list_en.png)

### Create a personal token
Anyone can create their own personal Token, once created, it cannot be changed.
1. Fill in the name of the personal Token (personal name is unique)
2. Click the Create button to complete the creation of personal Token.
3. After the creation is complete, you need to click "Copy Token" immediately, otherwise the Token will be hidden after leaving this page (if it is not saved in time, it is recommended to delete and create a new Token).

![personal create](/personal_create_en.png)

![personal copy](/personal_copy_en.png)

### Delete personal Token
After the personal Token is deleted, the personal Token will become invalid.
