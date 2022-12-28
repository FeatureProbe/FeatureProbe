---
sidebar_position: 7
---

# 配置Webhook

FeatureProbe提供推送消息到第三方应用的能力。
![WebHook list](/WebHook_list.png)

## 创建WebHook

1. WebHook的状态（开启后，WebHook的配置内容才能生效）
2. 填写WebHook名称
3. 填写描述信息
4. 填写URL（当特定事件发生时，我们将发送一个POST消息到这个URL）
5. 点击创建按钮，即可完成WebHook的创建。

![create WebHook](/WebHook.png)

## 编辑WebHook
WebHookURL变更后，当特定事件发生时，我们将发送POST消息到这个新的URL。

## 删除WebHook
删除WebHook后，我们将停止发送任何POST消息到这个URL。

## 处理WebHook消息
想了解更多接入内容，请参考[WebHook消息格式](../../reference/webhook-access)
