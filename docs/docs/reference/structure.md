---
sidebar_position: 1
---

# FeatureProbe  Architecture

**System Overview**

![featureprobe architecture](/structure.png)

* **FeatureProbe UI** - Provides users with a visual UI interface for managing and publishing feature switches.
* **FeatureProbe API** - Provides data management capabilities for the UI and external Open API services, designed to strictly adhere to Restful specifications, and as a common API for feature management domain not only provides core data management capabilities for the UI, but you can also automate switch rule changes and publishing based on this API. View OpenAPI documentation
* **FeatureProbe Server** - Provides a high-performance switch rule determination engine and second-level data distribution capabilities.
* **FeatureProbe SDK** - We provide SDKs for all major languages to obtain switch rule determination results, allowing you to quickly access FeatureProbe in your application to implement the corresponding feature switching capabilities.



## Architecture Features

### Performance

Since the SDK needs to be integrated into your application runtime environment, we have designed it to be highly fault-tolerant and high-performance. Even if FeatureProbe Server is not available, it will not affect the normal reading of the switch rules that are already in effect in your application, because we use multi-level caching and local memory-based rule logic calculations for the SDK on the Server side to support nanosecond-level fetching of switch decisions.



### Resilience

FeatureProbe Server is implemented in Rust language and is naturally high-performance and highly reliable. As you can see in the figure below, the fast horizontal scaling allows you to easily handle large-scale traffic access. At the same time, we are already planning to further improve the performance of the Server by using Multiplexing + Publish & Subscribe mode, so that the switch rules can be issued and take effect in milliseconds after changes.

![featureprobe server](/feature-probe-server.png)

### Privacy

The overall architecture also ensures privacy aspects since the switch execution happens only in the SDK run by the client. We do not collect or share any user data, which also allows us to confidently state that we are  [GDPR](https://gdpr-info.eu/) compliant.



### Extensibility

We open up all of our OpenAPI so you can extend or customize your business based on it.
