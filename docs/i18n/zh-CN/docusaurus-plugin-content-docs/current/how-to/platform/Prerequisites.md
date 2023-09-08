---
sidebar_position: 12
---

# 前置开关

前置开关允许您在FeatureProbe中控制功能开关之间的依赖关系。您可以使一个功能开关依赖于其他功能开关的某些条件才能生效。通过添加前置条件实现复杂实验人群的选择或实验层切分流量等

## 使用前置开关

您可以在开关配置的"目标人群”选项卡中管理前置条件。

![Add prerequisites](/prerequisites.png)

在上述示例中，该开关配置了前置开关 campaign_percentage_rollout 的`true`分组，作为前置条件，也就是说，只有命中了前置开关 campaign_percentage_rollout 的`true`分组的用户，才能进入到该开关中。

功能开关可以依赖于多个前置开关。如果一个功能开关具有多个前置开关，那么FeatureProbe在对用户评估依赖关系时必须满足所有前置开关的要求。
FeatureProbe 会自动阻止您保存可能引入前置条件之间循环依赖关系的更改（依赖层级不能超过20层）。例如，您如果将Toggle A设为Toggle B的前置条件，则不能并同时将Toggle B设为Toggle A的前置条件。

## 删除具有依赖关系的功能开关
您不能删除作为其他功能开关「前置条件」的开关。您必须先解除依赖关系，才能将其删除。
