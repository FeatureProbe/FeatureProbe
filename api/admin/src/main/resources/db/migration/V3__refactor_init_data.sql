UPDATE `targeting`
SET content = '{"rules":[],"disabledServe":{"select":0},"defaultServe":{"select":0},"variations":[{"value":"false","name":"Light skin","description":"Use default skin."},{"value":"true","name":"Dark skin", "description":"Switch to Dark skin."}]}'
WHERE toggle_key = 'header_skin';

UPDATE `toggle`
SET name = 'Change FeatureProbe Header Skin',
    description = 'Try change Default Rule to Serve Dark skin and Refresh!',
    variations = '[{"value":"false","name":"Light skin","description":"Use default skin."},{"value":"true", "name":"Dark skin", "description":"Switch to Dark skin."}]'
WHERE `key` = 'header_skin';

UPDATE `targeting`
SET content = '{"rules":[{"conditions":[{"type":"string","subject":"city","predicate":"is one of","objects":["Paris"]},{"type":"string","subject":"gender","predicate":"is one of","objects":["famale"]}],"name":"Paris women show 50% red buttons, 50% blue","serve":{"split":[5000,5000,0]}}],"disabledServe":{"select":1},"defaultServe":{"select":1},"variations":[{"value":"red","name":"Red Button","description":"Set button color to Red"},{"value":"blue","name":"Blue Button","description":"Set button color to Blue"}]}'
WHERE toggle_key = 'color_ab_test' and environment_key = 'online';

UPDATE `toggle`
SET name = 'Button Color AB Test',
    description = 'Test which color is more preferable',
    variations = '[{"value":"red","name":"","description":""},{"value":"blue","name":"","description":""}]',
    client_availability = 0
WHERE `key` = 'color_ab_test';

DELETE FROM `targeting` WHERE toggle_key = 'commodity_spike_activity';
DELETE FROM `toggle` WHERE `key` = 'commodity_spike_activity';

INSERT INTO `targeting`
VALUES (37, 'promotion_activity', 'online', 'My_First_Project', 3, 0,
        '{\"rules\":[{\"conditions\":[{\"type\":\"string\",\"subject\":\"city\",\"predicate\":\"is one of\",\"objects\":[\"Paris\"]}],\"name\":\"Users in Paris\",\"serve\":{\"select\":2}},{\"conditions\":[{\"type\":\"string\",\"subject\":\"city\",\"predicate\":\"is one of\",\"objects\":[\"Lille\"]}],\"name\":\"Users in Lille\",\"serve\":{\"select\":1}}],\"disabledServe\":{\"select\":0},\"defaultServe\":{\"select\":0},\"variations\":[{\"value\":\"7\",\"name\":\"discount 0.7\",\"description\":\"\"},{\"value\":\"8\",\"name\":\"discount 0.8\",\"description\":\"\"},{\"value\":\"9\",\"name\":\"discount 0.9\",\"description\":\"\"}]}',
        0, 'Admin', 'Admin', now(), now()),
       (38, 'promotion_activity', 'test', 'My_First_Project', 1, 1,
        '{\"rules\":[],\"disabledServe\":{\"select\":0},\"defaultServe\":{},\"variations\":[{\"value\":\"10\",\"name\":\"\",\"description\":\"\"},{\"value\":\"20\",\"name\":\"\",\"description\":\"\"},{\"value\":\"30\",\"name\":\"\",\"description\":\"\"}]}',
        0, 'Admin', 'Admin', now(), now());

INSERT INTO `toggle`
VALUES (19, 'Promotional Campaign', 'promotion_activity', 'Promotional Campaign in different city', 'number', 0,
        '[{\"value\":\"10\",\"name\":\"$10\",\"description\":\"\"},{\"value\":\"20\",\"name\":\"$20\",\"description\":\"\"},{\"value\":\"30\",\"name\":\"$30\",\"description\":\"\"}]',
        'My_First_Project', 0, 0, 0, 'Admin', 'Admin', now(), now());


DELETE FROM `targeting` WHERE toggle_key = 'product_inventory_fallback';
DELETE FROM `toggle` WHERE `key` = 'product_inventory_fallback';

INSERT INTO `toggle`
VALUES (20, 'Service Degrade', 'service_degrade', 'System degrade configuration.', 'boolean', 0,
        '[{\"value\":\"false\",\"name\":\"close\",\"description\":\"\"},{\"value\":\"true\",\"name\":\"open\",\"description\":\"\"}]',
        'My_first_Project', 0, 0, 0, 'Admin', 'Admin', now(), now());


INSERT INTO `targeting`
VALUES (41, 'service_degrade', 'online', 'My_first_Project', 2, 0,
        '{\"rules\":[],\"disabledServe\":{\"select\":0},\"defaultServe\":{\"select\":0},\"variations\":[{\"value\":\"false\",\"name\":\"normal\",\"description\":\"Do time consuming process as usual.\"},{\"value\":\"true\",\"name\":\"degrade\",\"description\":\"Bypass time consuming process.\"}]}',
        0, 'Admin', 'Admin', now(), now()),
       (42, 'service_degrade', 'test', 'My_first_Project', 1, 1,
        '{\"rules\":[],\"disabledServe\":{\"select\":0},\"defaultServe\":{\"select\":0},\"variations\":[{\"value\":\"false\",\"name\":\"normal\",\"description\":\"Do time consuming process as usual.\"},{\"value\":\"true\",\"name\":\"degrade\",\"description\":\"Bypass time consuming process.\"}]}',
        0, 'Admin', 'Admin', now(), now());