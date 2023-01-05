---
sidebar_position: 3
---

# Core Concepts
It contains a series of management operations such as 'feature granularity' release management, grayscale release, downgrade pre-programming, and AB experimental changes. It allows developers, operators, and O&M staff to complete feature delivery safely and efficiently, while finely controlling change risks. featureProbe provides high-performance services, SDKs in all major languages, and can provide state-of-the-art Feature Management services for software projects of all kinds of technology stacks in the era of continuous delivery.

Here we will introduce some basic concepts related to "feature management" and FeatureProbe.

## Feature Management

Feature management is a methodology and practice of software development. It proposes to plan, develop, test, release and obtain user feedback at the granularity of "feature", so that business partners, PMs, R&Ds, QAs, and SREs can focus more on independent "feature" delivery and an assessment of its commercial value. It is an advanced stage of continuous delivery and DevOps activities.

Feature management practices need the support of corresponding values, methodologies, practices and tools. FeatureProbe is a platform that natively supports the practice of feature management, born under the guidance of feature management methodology.

## Toggle

In feature management, we call the management entity of a single function a "toggle". According to the literal understanding, it manages whether this independent "feature" is open to users or closed to users. On the FeatureProbe platform, it is represented as a toggle configuration, and in the code or SDK, it is represented as a judgment result of whether a feature is enabled.

In practice, we will expand the concept of "toggle", so that a FeatureProbe toggle can not only carry two states of "enabled" and "disabled", but also carry more information, such as a number, a string, or even a piece of json text.

A toggle belongs to a certain project. After the toggle is created, it will appear in **all environments** of the project.

## Variation

A variation is a collection of return values that a toggle may obtain. For a toggle with only the simplest "toggle" function, there are only two variations, namely "on" and "off". We allow toggle to have more than two variations.

A toggle should contain at least two variations, but we allow the toggle to return multiple variation results so that the function can deliver different effects to different people. When the toggle type is not boolean, it is possible to configure more than two variations.

## Rule

A rule contains a selection condition for a crowd. You can add combined logic with AND or OR conditions to delineate a crowd in a rule, and specify which "variation" to return to this crowd.

## Project

A project is a collection of toggles, and the general management rules for toggles in a project, such as permissions, can be uniformly specified based on the project dimension. We recommend corresponding projects according to the service (microservice) granularity of the actual business.

## Environment

A project supports multiple environments, generally including online environment, test environment, development environment, etc. All environments **contain all toggles** under the project, but the settings of toggles in each project are usually different, for example, the same toggle is enabled in the test environment, but disabled in the online environment.

## Segment

Segments are some rules that can be shared within multiple toggles, and can be reused across toggle rules.

## Gradual Rollout

Since feature management naturally has the ability to open specific functions to specified people, gradual rollout is a natural ability of feature management. However, this kind of gradual rollout has the following differences from the traditional gradual rollout:

* "feature" dimension, not the version dimension
* Logical gradual rollout, not physical gradual rollout (machine gradual rollout, gateway offload traffic gradual rollout)

The dimensions are different, and it is also appropriate to use the two at the same time in scenarios that require high stability.
