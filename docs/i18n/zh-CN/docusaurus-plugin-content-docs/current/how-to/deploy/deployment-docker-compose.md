---
sidebar_position: 1
---

# Docker Compose 部署

> 本文档介绍如何Docker Compose部署 FeatureProbe 服务。

## 环境准备

* Docker 17+
* 建议：2核 CPU/4G内存及以上

## 部署

使用 docker-compose 快速在 Linux/Unix/Mac 上运行。

**操作步骤：**

1. 安装 [`git`](https://git-scm.com/) 和 [`docker`](https://www.docker.com/)
2. 国内默认链接从docker网站下载会比较慢，请先[配置国内docker镜像](https://gitee.com/featureprobe/FeatureProbe/blob/main/DOCKER_HUB.md)
3. 然后从github clone当前代码目录，按照以下命令启动服务：
   ```shell
   git clone https://gitee.com/featureprobe/FeatureProbe.git
   cd FeatureProbe
   docker compose up
   ```
4. docker启动成功后，打开浏览器，访问：`http://localhost:4009`，并用以下默认帐号登录试用：
   - username: `admin`
   - password: `Pass1234`