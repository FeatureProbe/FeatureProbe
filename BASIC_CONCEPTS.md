# Fundamental Concept

**Feature Toggle**: Dynamic configuration in the UI website, which can set rules to return different values ​​according to different attributes of the user. toggleKey is the unique identifier of the toggle.

**User**: A user is a container of various attributes (such as name, email, address, age, country, city, etc.), and the developer needs to pass in various attributes through the `with` method in the SDK. The UserKey passed in by the initialization method is the unique identifier of the user. It is used for percentage hash rollout, and other attributes are used for rule evaluation.

**Rule**: Dynamically determine the logical configuration of the return value. Different conditions can be set in the rules according to various attributes of the user. for example: `Rule 1: city == paris then true, Rule 2: name == 'bob' and city == 'london' then true`。

**Evaluation**: Evaluation refers to making logical judgments with various attributes in the user through the dynamic configuration in the rules. If the conditions are met, the corresponding results are returned.

**Value Functions**: It is used to get the value of the corresponding configuration through toggleKey and user. If no conditions are met, the default value set by the user is returned. Such as boolValue, stringValue methods.

**Detail Functions**: Similar to the value functions , but returns more information for debugging, such as the Reason field to explain why the value is returned. for example: boolDetail, stringDetail method.
