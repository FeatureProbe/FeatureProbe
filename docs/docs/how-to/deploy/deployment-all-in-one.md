---
sidebar_position: 1
---

# All-in-One Deploy Guide

> This document describes how to deploy the FeatureProbe service.


## Requirements

* Docker 17+

* MySQL 5.7+

* Recommendation: Production environment with 3 nodes and above

- Recommendation: 2-core CPU/4G memory and above

## Deploy FeatureProbe Service

### 一、Standalone

Get up and running on Linux/Unix/Mac quickly with docker-compose.

**Setps：**

1. Make sure you have [`git`](https://git-scm.com/) and [`docker`](https://www.docker.com/) installed. 。

2. Clone the repository to your server and boot up the services. Change the ports defined in docker-compose.yml as needed

3. For users in Mainland China, please refer to [configure mirror](https://github.com/FeatureProbe/FeatureProbe/blob/main/DOCKER_HUB.md) to speed up your download.

   ```shell
   git clone https://gitee.com/featureprobe/FeatureProbe.git
   cd FeatureProbe
   docker compose up
   ```

4. Go to UI/Portal at `localhost:4009` and use the default credentials to log in.

5. Remember to update the admin password after your first time login：

   - username: `admin`

   - password: `Pass1234`

