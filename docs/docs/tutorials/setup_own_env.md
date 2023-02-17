---
sidebar_position: 2
---

# Deploy a private environment 

We will take you to deploy FeatureProbe on your own server resources, so that you can have your own private environment to experience the features of FeatureProbe, and you can also directly manage your online services through this private environment.

This tutorial assumes that you understand the most basic git operations and basic docker principles, and have your own machine resources, which is suitable for users with certain technical backgrounds to learn.

## Preparations of tools and environments

1. Make sure your server is connected to the Internet.
2. Install [git](https://git-scm.com/).
3. Install [docker](https://www.docker.com/).
4. Network in China mainland access to docker hub may be slow, you need to add [docker image](https://gitee.com/featureprobe/FeatureProbe/blob/main/DOCKER_HUB.md).

## Install and start FeatureProbe

1. Use git to download the latest code of the FeatureProbe.
~~~bash
git clone https://gitee.com/featureprobe/FeatureProbe.git
~~~
2. Use docker composer to pull the image and start it.
~~~bash
cd FeatureProbe
docker compose up
~~~
3. Wait for the image to be pulled, depending on the network conditions, it may take 5-10 minutes.
4. Wait for the image to start, about 1 minute. After the startup is successful, you can see the log scrolling on the command line. You can also check the image startup status in the docker GUI tool. If everything is green, it means the startup is successful:
![docker startup](/docker_startup.png)

:::info
FeatureProbe contains 5 independent images, which can only run normally after all 5 images are successfully started. If a certain image fails to start successfully, you can restart the unsuccessful image separately in the docker GUI.
:::

## Verify installation results

Open the browser, visit [http://localhost:4009](http://localhost:4009), you can see the following login page:
![login](/docker_login_en.png)

Log in with the default account:
* `username`: admin
* `password`: Pass1234

Log in to see the four built-in toggles and start trying them out.
![toggle list](/docker_toggle_list_en.png)

:::info
Four built-in toggles for users to refer to various typical toggle configurations, users can choose to keep or delete according to their own needs, without affecting the use of the platform.
:::