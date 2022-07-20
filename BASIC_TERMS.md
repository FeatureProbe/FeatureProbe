# Basic Terms

**Feature Toggle**: A dynamic configuration item in the UI website. It returns different pre-configured values based on the user's attributes. 
The 'toggleKey' is the unique identifier of the toggle.

**User**: A collection of attributes, such as the user's name, email, address, age, country, city, etc. The developers need to
pass in attributes by using the "with" method to initiate a user instance. "UserKey" is the identifier of a user instance, and it is also
used to do proportional hash calculations. The other attributes are used to set up rules.

**Rule**: A predefined configuration that dynamically determines what toggles return. It makes use of user's attributes to 
set up one or more judging conditions to get returned values. If multiple judging conditions exist, the results are the 
intersection of the results from all the conditions. A toggle can have multiple rules and the returned values will be the intersection of all rules.

**Evaluation**: The process of making judgement and return results based on all the rules and user attributes. If the conditions are met, 
the corresponding results are returned. 
