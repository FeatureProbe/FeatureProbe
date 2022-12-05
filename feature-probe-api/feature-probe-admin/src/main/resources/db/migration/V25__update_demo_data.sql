UPDATE `toggle`
SET `variations` = '[{"value":"false","name":"Hide（隐藏）","description":"Hide campaign  page（隐藏活动页面）"},{"value":"true","name":"Show（展示）","description":"Show campaign  page （展示活动页面）"}]'
WHERE `key` = 'campaign_enable';

UPDATE `targeting`
SET `content` = '{"rules":[],"disabledServe":{"select":0},"defaultServe":{"select":1},"variations":[{"value":"false","name":"Hide（隐藏）","description":"Hide campaign  page（隐藏活动页面）"},{"value":"true","name":"Show（展示）","description":"Show campaign  page （展示活动页面）"}]}'
WHERE toggle_key = 'campaign_enable';


UPDATE `toggle`
SET `variations` = '[{"value":"false","name":"Hide（隐藏）","description":"Hide campaign  page（隐藏活动页面）"},{"value":"true","name":"Show（展示）","description":"Show campaign  page （展示活动页面）"}]'
WHERE `key` = 'campaign_allow_list';


UPDATE `targeting`
SET `content` = '{"rules":[{"conditions":[{"type":"string","subject":"userId","predicate":"is one of","objects":["00001","00002"],"segmentType":false,"numberType":false,"datetimeType":false,"semVerType":false}],"name":"","serve":{"select":1},"notEmptyConditions":true}],"disabledServe":{"select":0},"defaultServe":{"select":0},"variations":[{"value":"false","name":"Hide（隐藏）","description":"Hide campaign  page（隐藏活动页面）"},{"value":"true","name":"Show（展示）","description":"Show campaign  page （展示活动页面）"}]}'
WHERE toggle_key = 'campaign_allow_list';



UPDATE `toggle`
SET `variations` = '[{"value":"false","name":"Hide（隐藏）","description":"Hide campaign  page（隐藏活动页面）"},{"value":"true","name":"Show（展示）","description":"Show campaign  page （展示活动页面）"}]'
WHERE `key` = 'campaign_percentage_rollout';

UPDATE `targeting`
SET `content` = '{"rules":[], "disabledServe":{"select":0},"defaultServe":{"split":[6000,4000]}, "variations":[{"value":"false","name":"Hide（隐藏）","description":"Hide campaign  page（隐藏活动页面）"},{"value":"true","name":"Show（展示）","description":"Show campaign  page （展示活动页面）"}]}'
WHERE toggle_key = 'campaign_percentage_rollout';



UPDATE `toggle`
SET `variations` = '[{"value":"10","name":"Promotion price（优惠价 ）","description":""},{"value":"20","name":"Normal price（原价）","description":""}]'
WHERE `key` = 'promotion_campaign';

UPDATE `targeting`
SET `content` = '{"rules":[{"conditions":[{"type":"string","subject":"userId","predicate":"is one of","objects":["00001","00002"],"segmentType":false,"numberType":false,"datetimeType":false,"semVerType":false}],"name":"","serve":{"select":0},"notEmptyConditions":true},{"conditions":[{"type":"string","subject":"userId","predicate":"is one of","objects":["00003"],"segmentType":false,"numberType":false,"datetimeType":false,"semVerType":false}],"name":"","serve":{"select":1},"notEmptyConditions":true}],"disabledServe":{"select":1},"defaultServe":{"select":1},"variations":[{"value":"10","name":"Promotion price（优惠价 ）","description":""},{"value":"20","name":"Normal price（原价）","description":""}]}'
WHERE toggle_key = 'promotion_campaign';


UPDATE `targeting`
SET content = '{\"rules\":[],\"disabledServe\":{\"select\":1},\"defaultServe\":{\"select\":1},\"variations\":[{\"value\":\"https://featureprobe.io/server\",\"name\":\"online service\",\"description\":\"\"},{\"value\":\"http://localhost:4009/server\",\"name\":\"local docker\",\"description\":\"\"}]}'
WHERE toggle_key = 'remote_url' AND organization_id = -1;