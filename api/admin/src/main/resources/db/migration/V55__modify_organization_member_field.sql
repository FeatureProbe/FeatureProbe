ALTER TABLE `organization_member`
    ADD COLUMN `valid` TINYINT(3) NOT NULL DEFAULT 1 AFTER `role`;