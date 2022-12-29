---
sidebar_position: 8
---

# Open API Tokens

FeatureProbe提供2种不同的Tokens（共享Tokens、个人Tokens）用于访问 OpenAPI。
  - 共享Tokens：共享token不与个人绑定，一经创建不可变更，且永久生效。
  - 个人Tokens：个人Token具有与创建人相同的权限，且会随着创建人的权限同步变化，如果创建人被删除，他的Token也将失效。

## 共享Tokens

![shared list](/shared_list.png)

### 创建共享Token
任何人都可以创建共享Token，一旦创建，不可更改。
1. 填写共享Token的名称（租户下名称唯一）
2. 选择角色（不支持授予比自己权限更多的角色）
3. 点击创建按钮，即可完成共享Token的创建。
4. 创建完成后，需要马上点击”复制token“，否则离开该页面后，Token将会被隐藏（如果未及时保存，建议删除并重新创建一个新的Token）。

![shared create](/shared_create.png)

![shared copy](/shared_copy.png)

### 删除共享Token
删除共享Token后，该共享Token将失效。

## 个人Tokens

![personal list](/personal_list.png)

### 创建个人Token
任何人都可以创建自己的个人Token，一旦创建，不可更改。
1. 填写个人Token的名称（个人下名称唯一）
2. 点击创建按钮，即可完成个人Token的创建。
3. 创建完成后，需要马上点击”复制token“，否则离开该页面后，Token将会被隐藏（如果未及时保存，建议删除并重新创建一个新的Token）。

![personal create](/personal_create.png)

![personal copy](/personal_copy.png)

### 删除个人Token
删除个人Token后，该个人Token将失效。
