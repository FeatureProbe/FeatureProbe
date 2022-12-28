---
sidebar_position: 3
---

# How to use toggle detail

## Toggle targeting
The "configuration information" of the toggle (not shared between each environment, independently owned, modification of the configuration information will not be synchronized to the "template information" of the toggle), please toggle to the target environment, and then configure (the initial information of the configuration information will be automatically synchronized to the "template information" of the toggle) ")

![toggle targeting screenshot](/toggle_targeting_en.png)

1. Status: the status of the toggle (Disabled return value when disabled, Rules and Default Rule in the toggle configuration when enabled)
2. Variations: template information of the default synchronization toggle (can be changed)
3. Rules: "or" relationship between multiple Rules (the order of rules is very important, a user comes in and is screened from top to bottom, the first Rule hit will not match the following Rule, and the one not hit will continue to be screened down)

  - Add Rule: set "return value" for "specified group"
 
    + Fill in the rule name
    + filter "specified people" by "conditions", with and relationship between conditions (at least one condition)
      * Add conditions: select user attributes (custom add, enter to take effect), select the relationship, fill in the specific value (custom add, enter to take effect)
      * Delete condition: click the delete icon on the right side of the condition line to delete the condition
    + Specify the return value: select among the variations [you can select a certain variation (100% of this item), or specify the percentage of each variation (the sum of all the variations must be 100%)].
    + Click on the Rule card area and drag it to sort the rules freely
    + Delete Rule card: click the delete icon in the upper right corner of the card to delete the whole Rule

4. Set Default Rule: set the default return value for "unspecified population": choose from variations [you can choose a certain variation (100% of this item), or specify a percentage for each variation (the sum of all the variations (the sum of all the variations must be 100%)] 5.
5. Disabled return value: the template information of the default synchronization toggle (can be changed)
6. Click Publish to display the diff information before and after the change, and support filling in the [change description] (back in the history of the version)
7. Click confirm to finish publishing

## Connect to SDK
Facilitate users to access our SDK easily and efficiently, and clearly know the access status

![sdk screenshot](/sdk_en.png)

1. Step 1: Select the SDK for the target language, click [Save and Continue].
2. Step 2: Generate lines of code according to the SDK, you can quickly copy them to the code, click [Continue].
3. Step 3: Test the application access and return the access result.

## View history version

![history screenshot](/history_en.png)

Support for viewing the complete history of feature configuration changes