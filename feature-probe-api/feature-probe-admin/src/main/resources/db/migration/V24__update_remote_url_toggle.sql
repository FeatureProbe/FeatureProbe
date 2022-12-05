UPDATE `toggle`
SET name = 'Campaign  Enable',
    `key` = 'campaign_enable'
WHERE `key` = 'feature_toggle01';

UPDATE `targeting`
SET toggle_key = 'campaign_enable'
WHERE toggle_key = 'feature_toggle01';

UPDATE `variation_history`
SET toggle_key = 'campaign_enable'
WHERE toggle_key = 'feature_toggle01';

UPDATE `targeting_version`
SET toggle_key = 'campaign_enable'
WHERE toggle_key = 'feature_toggle01';


UPDATE `toggle`
SET name = 'Campaign  Allow List',
    `key` = 'campaign_allow_list'
WHERE `key` = 'feature_toggle02';

UPDATE `targeting`
SET toggle_key = 'campaign_allow_list'
WHERE toggle_key = 'feature_toggle02';

UPDATE `variation_history`
SET toggle_key = 'campaign_allow_list'
WHERE toggle_key = 'feature_toggle02';

UPDATE `targeting_version`
SET toggle_key = 'campaign_allow_list'
WHERE toggle_key = 'feature_toggle02';


UPDATE `toggle`
SET name = 'Campaign  Percentage Rollout',
    `key` = 'campaign_percentage_rollout'
WHERE `key` = 'feature_toggle03';

UPDATE `targeting`
SET toggle_key = 'campaign_percentage_rollout'
WHERE toggle_key = 'feature_toggle03';

UPDATE `variation_history`
SET toggle_key = 'campaign_percentage_rollout'
WHERE toggle_key = 'feature_toggle03';

UPDATE `targeting_version`
SET toggle_key = 'campaign_percentage_rollout'
WHERE toggle_key = 'feature_toggle03';


UPDATE `toggle`
SET name = 'Promotion Campaign',
    `key` = 'promotion_campaign'
WHERE `key` = 'feature_toggle04';

UPDATE `targeting`
SET toggle_key = 'promotion_campaign'
WHERE toggle_key = 'feature_toggle04';

UPDATE `variation_history`
SET toggle_key = 'promotion_campaign'
WHERE toggle_key = 'feature_toggle04';

UPDATE `targeting_version`
SET toggle_key = 'promotion_campaign'
WHERE toggle_key = 'feature_toggle04';


UPDATE `targeting`
SET content = '{\"rules\":[],\"disabledServe\":{\"select\":1},\"defaultServe\":{\"select\":1},\"variations\":[{\"value\":\"https://featureprobe.io/server\",\"name\":\"online service\",\"description\":\"\"},{\"value\":\"http://127.0.0.1:4007\",\"name\":\"local docker\",\"description\":\"\"}]}'
WHERE toggle_key = 'remote_url' AND organization_id = -1;