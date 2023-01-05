# Deploy Guide

This document describes how to deploy the FeatureProbe service.

## Deployment mode

The FeatureProbe architecture is as follows:

![deploy](/featureprobe_deploy.png)

the corresponding mode can be selected according to the actual scene:

### All-in-One Deployment

It is generally used for local testing or trials, deploying all sub-services in one deployment unit (container, virtual machine, physical machine), and the deployment steps are simple.

### Sub-service docker deployment

Use the sub-service docker image provided by FeatureProbe and deploy it in a separate deployment unit. The deployment process is a little complicated and flexible, and the sub-services can be expanded independently.

### Source code compilation and deployment

Compile each sub-service provided by FeatureProbe from the source code, directly deploy or start the locally built binary program, the construction and deployment process is complex, the flexibility is higher, and the source code modification effect can be verified.