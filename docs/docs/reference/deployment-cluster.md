---
sidebar_position: 7
---

# Deploy a Cluster

> This document describes how to deploy the FeatureProbe service in a multi-cluster manner.

## Deployment topology

In order to ensure the high availability of the overall service, we recommend the deployment topology as follows:

![image-20220906181332418](/deploy.png)

An independent FeatureProbe cluster consists of three parts:

- Admin cluster

   An Admin service consists of UI (Nginx) and API modules. The cluster can use *domain name* or *VIP* mode load balancing mechanism

- Server cluster

   Relying on the API service, you need to access the API service in the Admin cluster under the same cluster. This service provides the SDK with toggle caculation and distribution capabilities, and it is recommended to provide external access in the form of *domain name*

- Database cluster

   It is recommended to use the one-master-multiple-slave cluster mode.

**Network Policy**

- Control the Admin cluster and database only for internal network access, and it is not recommended to expose it to the public network.
- The server cluster needs to provide toggle caculation capabilities for the APP SDK and JS SDK, so it needs to be accessible on the public network. If you only use the Server SDK to access, it does not need to be exposed to the public network.



## Multiple Environments

FeatureProbe itself provides multi-environment support, and the data between different environments is logically isolated, so there is no need to deploy separate environments for different environments.

> For support for multiple environments and custom environments, please reference [How to use project and environment](/how-to/platform/project-and-environment)



