---
sidebar_position: 12
---

# How to use prerequisite

The prerequisite toggle是 allows you to control the dependency relationships between feature toggles in FeatureProbe. You can make a feature toggle dependent on certain conditions of other feature toggles in order to be effective. By adding prerequisites, you can implement complex targeting or experiment layering by selecting specific segments of users.

## Using Prerequisite Switches

You can manage prerequisites in the "Targetting" tab of the toggle configuration.

![Add prerequisites](/prerequisites.png)

In the example above, the toggle is configured with a prerequisite for the true group of the prerequisite toggle campaign_percentage_rollout. This means that only users who are assigned to the true group of the prerequisite toggle campaign_percentage_rollout will enter this toggle.

A feature toggle can depend on multiple prerequisite toggles. If a feature toggle has multiple prerequisites, FeatureProbe must satisfy the requirements of all prerequisites when evaluating the user.

FeatureProbe automatically prevents you from saving changes that introduce circular dependencies among prerequisites (the dependency level cannot exceed 20 levels). For example, if you set Toggle A as a prerequisite for Toggle B, you cannot also set Toggle B as a prerequisite for Toggle A.

## Deleting toggles that serves as a prerequisite for other toggles.
You cannot delete toggles that serves as a "prerequisite" for other feature toggles. You must first remove the dependency before you can delete it.
