DELETE from `toggle` where `key` = "color_ab_test" AND organization_id=1;
DELETE from `targeting` where `toggle_key` = "color_ab_test" AND organization_id=1;
DELETE from `toggle` where `key` = "header_skin" AND organization_id=1;
DELETE from `targeting` where `toggle_key` = "header_skin" AND organization_id=1;
DELETE from `toggle` where `key` = "promotion_activity" AND organization_id=1;
DELETE from `targeting` where `toggle_key` = "promotion_activity" AND organization_id=1;
DELETE from `toggle` where `key` = "service_degrade" AND organization_id=1;
DELETE from `targeting` where `toggle_key` = "service_degrade" AND organization_id=1;

INSERT INTO `toggle` (`organization_id`, `name`, `key`, `description`, `return_type`, `disabled_serve`, `variations`, `project_key`, `archived`, `client_availability`, `deleted`, `modified_by`, `created_by`, `created_time`, `modified_time`) VALUES (1, 'feature toggle01', 'feature_toggle01', '', 'boolean', 0, '[{\"value\":\"false\", \"name\":\"disabled\",\"description\":\"\"},{\"value\":\"true\",\"name\":\"enabled\",\"description\":\"\"}]', 'My_first_Project', 0, 1, 0, 1, 1, now(), now());

INSERT INTO `targeting` (`organization_id`, `toggle_key`, `environment_key`, `project_key`, `version`, `disabled`, `content`, `deleted`, `modified_by`, `created_by`, `created_time`, `modified_time`) VALUES (1, 'feature_toggle01', 'online', 'My_first_Project', 1, 1, '{\"rules\":[],\"disabledServe\":{\"select\":0},\"defaultServe\":{\"select\":1},\"variations\":[{\"value\":\"false\",\"name\":\"disabled\",\"description\":\"\"},{\"value\":\"true\",\"name\":\"enabled\",\"description\":\"\"}]}', 0, 1, 1, now(), now());

INSERT INTO `variation_history` (`organization_id`, `project_key`, `toggle_key`, `environment_key`, `toggle_version`, `value`, `value_index`, `name`) VALUES (1, 'My_first_Project', 'feature_toggle01', 'online', 1, 'true', 1, 'enabled');

INSERT INTO `variation_history` (`organization_id`, `project_key`, `toggle_key`, `environment_key`, `toggle_version`, `value`, `value_index`, `name`) VALUES (1, 'My_first_Project', 'feature_toggle01', 'online', 1, 'false', 0, 'disabled');

INSERT INTO `targeting_version` (`organization_id`, `project_key`, `environment_key`, `toggle_key`, `comment`, `content`, `disabled`, `version`, `deleted`, `modified_time`, `created_by`, `created_time`, `modified_by`) VALUES (1, 'My_first_Project', 'online', 'feature_toggle01', '', '{\"rules\":[],\"disabledServe\":{\"select\":0},\"defaultServe\":{\"select\":1},\"variations\":[{\"value\":\"false\",\"name\":\"disabled\",\"description\":\"\"},{\"value\":\"true\",\"name\":\"enabled\",\"description\":\"\"}]}', 1, 1, 0, now(), 1, now(), 1);


INSERT INTO `toggle` (`organization_id`, `name`, `key`, `description`, `return_type`, `disabled_serve`, `variations`, `project_key`, `archived`, `client_availability`, `deleted`, `modified_by`, `created_by`, `created_time`, `modified_time`) VALUES (1, 'feature toggle02', 'feature_toggle02', '', 'boolean', 0, '[{\"value\":\"false\",\"name\":\"disabled\",\"description\":\"\"},{\"value\":\"true\",\"name\":\"enabled\",\"description\":\"\"}]', 'My_first_Project', 0, 1, 0, 1, 1, now(), now());

INSERT INTO `targeting` (`organization_id`, `toggle_key`, `environment_key`, `project_key`, `version`, `disabled`, `content`, `deleted`, `modified_by`, `created_by`, `created_time`, `modified_time`) VALUES (1, 'feature_toggle02', 'online', 'My_first_Project', 1, 0, '{\"rules\":[{\"conditions\":[{\"type\":\"string\",\"subject\":\"userId\",\"predicate\":\"is one of\",\"objects\":[\"00001\",\"00002\"],\"segmentType\":false,\"numberType\":false,\"datetimeType\":false,\"semVerType\":false}],\"name\":\"\",\"serve\":{\"select\":1},\"notEmptyConditions\":true}],\"disabledServe\":{\"select\":0},\"defaultServe\":{\"select\":0},\"variations\":[{\"value\":\"false\",\"name\":\"disabled\",\"description\":\"\"},{\"value\":\"true\",\"name\":\"enabled\",\"description\":\"\"}]}', 0, 1, 1, now(), now());

INSERT INTO `variation_history` (`organization_id`, `project_key`, `toggle_key`, `environment_key`, `toggle_version`, `value`, `value_index`, `name`) VALUES (1, 'My_first_Project', 'feature_toggle02', 'online', 1, 'true', 1, 'enabled');

INSERT INTO `variation_history` (`organization_id`, `project_key`, `toggle_key`, `environment_key`, `toggle_version`, `value`, `value_index`, `name`) VALUES (1, 'My_first_Project', 'feature_toggle02', 'online', 1, 'false', 0, 'disabled');

INSERT INTO `targeting_version` (`organization_id`, `project_key`, `environment_key`, `toggle_key`, `comment`, `content`, `disabled`, `version`, `deleted`, `modified_time`, `created_by`, `created_time`, `modified_by`) VALUES (1, 'My_first_Project', 'online', 'feature_toggle02', '', '{\"rules\":[{\"conditions\":[{\"type\":\"string\",\"subject\":\"userId\",\"predicate\":\"is one of\",\"objects\":[\"00001\",\"00002\"],\"segmentType\":false,\"numberType\":false,\"datetimeType\":false,\"semVerType\":false}],\"name\":\"\",\"serve\":{\"select\":1},\"notEmptyConditions\":true}],\"disabledServe\":{\"select\":0},\"defaultServe\":{\"select\":0},\"variations\":[{\"value\":\"false\",\"name\":\"disabled\",\"description\":\"\"},{\"value\":\"true\",\"name\":\"enabled\",\"description\":\"\"}]}', 0, 1, 0,  now(), 1, now(), 1);



INSERT INTO `toggle` (`organization_id`, `name`, `key`, `description`, `return_type`, `disabled_serve`, `variations`, `project_key`, `archived`, `client_availability`, `deleted`, `modified_by`, `created_by`, `created_time`, `modified_time`) VALUES (1, 'feature toggle03', 'feature_toggle03', '', 'boolean', 0, '[{\"value\":\"false\",\"name\":\"disabled\",\"description\":\"\"},{\"value\":\"true\",\"name\":\"enabled\",\"description\":\"\"}]', 'My_first_Project', 0, 1, 0, 1, 1, now(), now());

INSERT INTO `targeting` (`organization_id`, `toggle_key`, `environment_key`, `project_key`, `version`, `disabled`, `content`, `deleted`, `modified_by`, `created_by`, `created_time`, `modified_time`) VALUES (1, 'feature_toggle03', 'online', 'My_first_Project', 1, 0, '{\"rules\":[], \"disabledServe\":{\"select\":0},\"defaultServe\":{\"split\":[6000,4000]}, \"variations\":[{\"value\":\"false\",\"name\":\"disabled\",\"description\":\"\"},{\"value\":\"true\",\"name\":\"enabled\",\"description\":\"\"}]}', 0, 1, 1, now(), now());

INSERT INTO `variation_history` (`organization_id`, `project_key`, `toggle_key`, `environment_key`, `toggle_version`, `value`, `value_index`, `name`) VALUES (1, 'My_first_Project', 'feature_toggle03', 'online', 1, 'true', 1, 'enabled');

INSERT INTO `variation_history` (`organization_id`, `project_key`, `toggle_key`, `environment_key`, `toggle_version`, `value`, `value_index`, `name`) VALUES (1, 'My_first_Project', 'feature_toggle03', 'online', 1, 'false', 0, 'disabled');

INSERT INTO `targeting_version` (`organization_id`, `project_key`, `environment_key`, `toggle_key`, `comment`, `content`, `disabled`, `version`, `deleted`, `modified_time`, `created_by`, `created_time`, `modified_by`) VALUES (1, 'My_first_Project', 'online', 'feature_toggle03', '', '{\"rules\":[],\"disabledServe\":{\"select\":0},\"defaultServe\":{\"split\":[8000,2000]},\"variations\":[{\"value\":\"false\",\"name\":\"disabled\",\"description\":\"\"},{\"value\":\"true\",\"name\":\"enabled\",\"description\":\"\"}]}', 0, 1, 0, now(), 1, now(), 1);



INSERT INTO `toggle` (`organization_id`, `name`, `key`, `description`, `return_type`, `disabled_serve`, `variations`, `project_key`, `archived`, `client_availability`, `deleted`, `modified_by`, `created_by`, `created_time`, `modified_time`) VALUES (1, 'feature toggle04', 'feature_toggle04', '', 'number', 1, '[{\"value\":\"10\",\"name\":\"$10\",\"description\":\"\"},{\"value\":\"20\",\"name\":\"$20\",\"description\":\"\"}]', 'My_first_Project', 0, 1, 0, 1, 1, now(), now());

INSERT INTO `targeting` (`organization_id`, `toggle_key`, `environment_key`, `project_key`, `version`, `disabled`, `content`, `deleted`, `modified_by`, `created_by`, `created_time`, `modified_time`) VALUES (1, 'feature_toggle04', 'online', 'My_first_Project', 1, 0, '{\"rules\":[{\"conditions\":[{\"type\":\"string\",\"subject\":\"userId\",\"predicate\":\"is one of\",\"objects\":[\"00001\",\"00002\"],\"segmentType\":false,\"numberType\":false,\"datetimeType\":false,\"semVerType\":false}],\"name\":\"\",\"serve\":{\"select\":0},\"notEmptyConditions\":true},{\"conditions\":[{\"type\":\"string\",\"subject\":\"userId\",\"predicate\":\"is one of\",\"objects\":[\"00003\"],\"segmentType\":false,\"numberType\":false,\"datetimeType\":false,\"semVerType\":false}],\"name\":\"\",\"serve\":{\"select\":1},\"notEmptyConditions\":true}],\"disabledServe\":{\"select\":1},\"defaultServe\":{\"select\":1},\"variations\":[{\"value\":\"10\",\"name\":\"$10\",\"description\":\"\"},{\"value\":\"20\",\"name\":\"$20\",\"description\":\"\"}]}', 0, 1, 1, now(), now());

INSERT INTO `variation_history` (`organization_id`, `project_key`, `toggle_key`, `environment_key`, `toggle_version`, `value`, `value_index`, `name`) VALUES (1, 'My_first_Project', 'feature_toggle04', 'online', 1, '20', 1, '$20');

INSERT INTO `variation_history` (`organization_id`, `project_key`, `toggle_key`, `environment_key`, `toggle_version`, `value`, `value_index`, `name`) VALUES (1, 'My_first_Project', 'feature_toggle04', 'online', 1, '10', 0, '$10');

INSERT INTO `targeting_version` (`organization_id`, `project_key`, `environment_key`, `toggle_key`, `comment`, `content`, `disabled`, `version`, `deleted`, `modified_time`, `created_by`, `created_time`, `modified_by`) VALUES (1, 'My_first_Project', 'online', 'feature_toggle04', '', '{\"rules\":[{\"conditions\":[{\"type\":\"string\",\"subject\":\"userId\",\"predicate\":\"is one of\",\"objects\":[\"00001\",\"00002\"],\"segmentType\":false,\"numberType\":false,\"datetimeType\":false,\"semVerType\":false}],\"name\":\"\",\"serve\":{\"select\":0},\"notEmptyConditions\":true},{\"conditions\":[{\"type\":\"string\",\"subject\":\"userId\",\"predicate\":\"is one of\",\"objects\":[\"00003\"],\"segmentType\":false,\"numberType\":false,\"datetimeType\":false,\"semVerType\":false}],\"name\":\"\",\"serve\":{\"select\":1},\"notEmptyConditions\":true}],\"disabledServe\":{\"select\":1},\"defaultServe\":{\"select\":1},\"variations\":[{\"value\":\"10\",\"name\":\"$10\",\"description\":\"\"},{\"value\":\"20\",\"name\":\"$20\",\"description\":\"\"}]}', 0, 1, 0, now(), 1, now(), 1);