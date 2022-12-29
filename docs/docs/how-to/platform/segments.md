---
sidebar_position: 5
---

# How to use segments

## Add Segment
Commonly used groups of people can be set up as separate user groups, making it easy to select them repeatedly in the toggle

![segment screenshot](/segment_en.png)

1. fill in the group name
2. fill in the crowd group key (the crowd group's unique identifier, unique under the same project, once created can not be edited)
3. fill in the description information
4. Rules: multiple Rule for the "or" relationship between (the order of rules is very important, a user comes in, from the top to the bottom in order to filter, hit the first Rule will not match the following Rule, not hit before continuing down the screen)

  - Add Rule: "specified people" that meet certain conditions
 
    + Fill in the rule name
    + filter "specified people" based on "user attributes", and the relationship between the conditions is and
      * Add condition: select user attributes (custom add, enter to take effect), select relationship, fill in specific values (custom add, enter to take effect)
      * Delete condition: click the delete icon on the right side of the condition line to delete the condition
    + Click on the Rule card area and drag to sort the rules freely
    + Delete Rule card: Click the delete icon in the upper right corner of the card to delete the whole Rule

5. Click the Create button to complete the creation of the crowd group


## Edit group
The edited group will be synced to the toggles that already use the group.

## Deleting Crowd Groups
Only groups that are not used by any toggle can be deleted.
