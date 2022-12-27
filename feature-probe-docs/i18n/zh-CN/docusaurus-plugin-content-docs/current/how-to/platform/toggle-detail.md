---
sidebar_position: 3
---

# 开关配置

## 开关配置
开关的“配置信息”（各环境间不共享，独立拥有,修改配置信息，不会同步到开关的"模板信息"），请切换到目标环境后，再进行配置（配置信息的初始信息，会自动同步开关的“模板信息”）

![toggle targeting screenshot](/toggle_targeting_zh.png)

1. Status：开关的状态（禁用后生效Disabled return value，启用后开关配置中的Rules及Default Rule生效）
2. Variations：默认同步开关的模板信息（可更改）
3. Rules：多个Rule之间为“或”关系（rule的顺序很重要，一个用户进来，是从上往下依次筛选的，命中了第一个Rule就不会再匹配下面的Rule，没命中的才会继续往下筛）

  - 添加Rule：为“指定人群”设置“返回值”
 
    + 填写rule名称
    + 根据“条件”筛选“指定人群”，条件之间为且的关系（至少有一个条件）
      * 添加条件：选择用户属性（自定义添加，回车生效）、选择关系符、填写具体的值（自定义添加，回车生效）
      * 删除条件：点击条件行右侧的删除icon，即可删除该条件
    + 指定返回值：在variations中选择【可以选择某一个variation（该项占比100%），也可以每个variation指定百分比（所有的variation占比之和必须为100%）】
    + 点击Rule卡片区域并拖动，可以对rule进行自由排序
    + 删除Rule卡片：点击卡片右上角删除icon即可删除整条Rule

4. 设置Default Rule：为“未指定人群”设置默认返回值：在variations中选择【可以选择某一个variation（该项占比100%），也可以每个variation指定百分比（所有的variation占比之和必须为100%）】
5. Disabled return value：默认同步开关的模板信息（可更改）
6. 点击Publish，展示更改前后的diff信息，且支持填写【变更说明】（回显在历史版本中）
7. 点击confirm，完成发布


## 连接SDK
便于用户简单、高效的接入我们的SDK、明确知悉接入状态

![sdk screenshot](/sdk_zh.png)

1. 步骤1：选择目标语言的SDK，点击【保存并继续】
2. 步骤2：根据SDK生成代码行，可以快速复制到代码中，点击【继续】
3. 步骤3：测试应用接入情况，返回接入结果。

## 查看历史版本

![history screenshot](/history_zh.png)

支持查看功能配置变更的完整历程

