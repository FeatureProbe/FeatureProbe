---
sidebar_position: 2
---

# Popular Use Cases
New features launching or version release are the most common use of FeatureProbe. When we launch a new feature or update the service, we can enable them for a small fraction of the users in the first place to make sure things go 
smoothly without impacting the majority of users. If those users don't complain or even give good feedback, we 
can populate the changes to more users, and repeat the procedure till all users update to the new version.

Further more, there are many other scenarios where we can use FeatureProbe.
### Online Promotion Activities
 
 Many companies periodically carry out promotion activities to boost sales. 
These activities use similar templates in most cases, and the operation team just need to modify several parameters to create a new promotion.

- Use Case: An online shopping platform carries out a Black Friday sales gala and needs to change prices for many 
   items. In the past, the R&D team change items prices and launch the changes with a long workflow. Now they can use 
   FeatureProbe to toggle the items price and make them effective within a second.

- Operation Procedure
   
     * The online sales operation team adds a new project named "My First Project" and adds a feature toggle 
   named "commodity\_spike\_activity" for the "online" environment. Shown in below picture:
   ![commodity spike activity screenshot](/commodity_spike_activity.png)
    * The developer imports the FeatureProbe SDK in the code base (Java code as an example), and uses the "commodity\_spike\_activity" toggle 
   by setting the sdk Key which is assigned by FeatureProbe to "My First Project" "online" environment. 
   The variations type is number, and the user parameter is "city". 
  
    ```java
   FPUser user = new FPUser(user_id);
   user.with("city", city_name);
   double discount = fpClient.numberValue("commodity_spike_activity", user, 1.0);
   discountSetTo(discount);
    ```
  
   * The developer launches code base. Then operation people enable the toggle to make the city based pricing incentive
   policy get effective.
   * If the operation team needs to change prices, they can change the price variation settings on the FeatureProbe UI easily.

### Service Degradation

When the online service encounters extremely high demands that impact some dependency services 
or there is something goes wrong (for example, a backend service gets inaccessible unexpectedly), we need to guarantee 
the essential services work without disruption by using the cached data rather than fetching data from those problem services.

- Use Case: The ecommerce service needs to call an inventory stocking service to show the product stocking information.
   If the stocking service encounters some issue and is not available, the operation team can make use of FeatureProbe to 
   get stocking data from the cached content within a second and carry out the time costly application fallback operation 
   or switch over to a backup service without interrupt the online service.
   
- Operation Procedure
   * The R&D team adds a new project named "My First Project" and adds a feature toggle 
   named "store\_service\_fallback" for the "online" environment. Shown in below picture:
   ![storage service fallback screenshot](/store_service_fallback.png)
   * The developer imports the FeatureProbe SDK in the code base (Java code as an example), and uses the "store\_service\_fallback" toggle 
   by setting the sdk Key which is assigned by FeatureProbe to "My First Project" "online" environment. 
   The variations type is boolean, and its result enables or disables the degradation.  
  
   ```java
    FPUser user = new FPUser(user_id);
    boolean fallback = fpClient.boolValue("store_service_fallback", user, false);
    if (fallback) {
    	// Do something.
    } else {
    	// Do normal process.
    }
   ```
		   
   * When there is something wrong with the dependency services, the operation team can change the variation from False to 
   True to enable the degradation with cached/staled data to prevent service from being interrupted.

### A/B Testing

Design several solutions for a specific service, try them all and find out the most optimal/popular one.
 
- Use Case 1: Decide a button's color. Mike, the product manager, wants to change a "Buy" button for their ecommerce 
   platform in Paris. The original color is in red, and he believes the Paris people would like blue, and he also wants 
   to try green. He uses FeatureProbe to do the A/B testing to find out the better choice.
- Operation Procedure
   * The operation team adds a new project named "My First Project" and adds a feature toggle 
   named "color\_ab\_test" for the "online" environment. Shown in below picture:
   ![AB test screenshot](/color_ab_test.png)
   * The developer imports the FeatureProbe SDK in the code base (Java code as an example), and uses the "color\_ab\_test" toggle 
   by setting the sdkKey which is assigned by FeatureProbe to "My First Project" "online" environment. 
   The variations type is string, and the user parameter is "city". 
   
	```java
    FPUser user = new FPUser(user_id);
    user.with("city", city_name);
    String color = fpClient.stringValue("color_ab_test", user, "red");
    setButtonColor(color);
	```
	   
   * The developer launches code base. Then operation people enable the toggle to make the city based color setting
   get effective.
   * After several days of testing, Mike finds out that Paris people click the purchase button more when it is in blue,
   and he carries our the configuration to show blue button for all Paris customers.

