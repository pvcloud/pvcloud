ALTER TABLE `iot_elements` ADD `device_name` VARCHAR(20) NULL AFTER `element_key`, ADD INDEX `ix_device_name` (`device_name`);