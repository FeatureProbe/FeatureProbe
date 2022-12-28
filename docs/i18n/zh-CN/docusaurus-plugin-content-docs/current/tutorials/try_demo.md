---
sidebar_position: 1
---

# 操作开关

您将学习到如何在FeatureProbe平台上操作一个已有的开关，并观察到开关配置变化后是如何影响到我们提供的演示网页的展示情况的。

您将学到的主要平台操作包括：
* 启用（Enable）一个开关
* 将一个用户加入开关的白名单中
* 修改一个开关的放量百分比
* 增加一个返回值分组

本教程没有任何编程能力要求，适合各类角色的用户了解平台功能。

## 登录学习帐号

在浏览器中打开学习环境：[https://featureprobe.io/demo/](https://featureprobe.io/demo/), 填入你的邮箱地址，进入专属于你的学习环境。
![demo login](/demo_login_cn.png)

:::info
https://featureprobe.io/demo/ 是一个演示页面，我们将通过FeatureProbe平台来控制这个页面的展示。填入邮箱登录后，您可以通过演示页面的提示链接跳转到FeatureProbe平台，
或者也可以直接访问 [https://featureprobe.io](https://featureprobe.io) 进入平台。
:::

## 开关『Enable』

学习打开一个关闭的开关。

### 操作『Enable』

1. 从[演示页面](https://featureprobe.io/demo/)任务一点击链接，进入FeatureProbe平台，此时将进入开关 Campaign Enable 的配置页面：
![enable campaign](/demo_enable_cn.png)

2. 将 "Campaign Enable" 开关『启用』，点击『状态』后的启用按钮，之后点击『发布』按钮。
![campaign enable config](/demo_campaign_enable_publish_cn.png)

:::info 
开关新建之后，默认都是未『启用』的，需要通过『启用』来生效这个开关的配置。
:::

3. 点击『确认』发布。
![confirm](/demo_enable_confirm_publish_cn.png)

### 验证结果

回到演示页面的链接：[https://featureprobe.io/demo/](https://featureprobe.io/demo/), 可以开到页面展示由

发布前：
![before_enable](/demo_enable_before_action_cn.png)

变为发布后：
![after_enable](/demo_enable_after_action_cn.png)

:::info
页面刷新可能稍有延时，发布完成后，也可手动刷新演示页面查看结果。
:::

这里我们体验了如何 Enable 一个开关，并看到了 Enable 之后，演示页面的用户就能够看到之前看不到的活动图片了。

## 编辑开关规则

学习在一个白名单规则中增加一个能进入白名单的ID

### 操作『Rule』

1. 从[演示页面](https://featureprobe.io/demo/)任务二点击进入开关[编辑页面](https://featureprobe.io/My_Project/online/campaign_allow_list/targeting)
![allow_list](/demo_allow_list_link_cn.png)

2. 在 `规则1` 的 userId 白名单中增加一个用户： 00003 （就是当前你自己的ID），点击回车
![add user](/allow_list_add_00003.png)

3. 点击下方『发布』，并『确认』
![allow list publish](/allow_list_publish_cn.png)
![allow list confirm](/allow_list_confirm_cn.png)

### 验证结果

回到演示页面的链接：[https://featureprobe.io/demo/](https://featureprobe.io/demo/), 现在你作为userId 00003的用户可以看到页面展示由
![not show](/demo_allow_list_not_show_cn.png)

变为：
![show](/demo_allow_list_show_cn.png)

## 修改放量百分比

学习修改灰度放量的百分比。让你自己（userId 00003）从非灰度用户，进入到被灰度用户中。

### 操作『Rule』

1. 从[演示页面](https://featureprobe.io/demo/)点击进入任务三开关[编辑页面](https://featureprobe.io/My_Project/online/campaign_percentage_rollout/targeting)
![percentage link](/demo_percentage_link_cn.png)

2. 在`默认规则`中，将Show（展示）的百分比提升到90%，将Hide（隐藏）的百分比调整为10%
![percentage config](/demo_percentage_publish_cn.png)

3. 点击下方『发布』，并『确认』

### 验证结果

回到演示页面的链接：[https://featureprobe.io/demo/](https://featureprobe.io/demo/), 现在你作为userId 00003的用户可以看到页面展示由
![percentage before](/demo_percentage_not_show_cn.png)

变为：
![percentage show](/demo_percentage_after_cn.png)

## 增加一个返回值分组

学习增加一个返回值分组，让你自己（userId 00003）进入这个新的分组，并看到这个新增分组所设定的商品价格。

### 操作『Rule』

1. 从[演示页面](https://featureprobe.io/demo/)点击进入任务四开关[编辑页面](https://featureprobe.io/My_Project/online/promotion_campaign/targeting)
![variation link](/demo_variant_link_cn.png)   

2. 在`分组`中，点击『添加分组』，将新加的分组命名为『another price』并将值设置为 30
![add group](/demo_variant_add_group_cn.png)   
![group added](/demo_variant_group_3_added_cn.png)

:::info
给分组起一个好的名称可以帮你更好的管理分组值，在后续的配置中可以直接选择分组名称。如果后续因为业务变化，返回值发生了变化则只需要在分组设置中改变分组的值，而不需要修改规则中的返回分组名称。
:::

3. 将 `规则2` （用户00003所在的规则）中的返回值，修改为新建的分组『another price』
![use new group](/demo_variantion_return_another_cn.png)

4. 点击下方『发布』，并『确认』

### 验证结果

回到演示页面的链接：[https://featureprobe.io/demo/](https://featureprobe.io/demo/), 现在你作为userId 00003的用户可以看到页面展示由
![original](/demo_variant_orig_cn.png)

变为：
![show another price](/demo_variation_show_30_cn.png)