-- DROP database chat;
CREATE DATABASE chat;

USE chat;

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/


 -- ---
 -- Globals
 -- ---

 -- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
 -- SET FOREIGN_KEY_CHECKS=0;

 -- ---
 -- Table 'Rooms'
 -- 
 -- ---

 DROP TABLE IF EXISTS `Rooms`;
    
 CREATE TABLE `Rooms` (
   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
   `roomname` VARCHAR(20) NOT NULL DEFAULT 'NULL',
   PRIMARY KEY (`id`)
 );

 -- ---
 -- Table 'Users'
 -- 
 -- ---

 DROP TABLE IF EXISTS `Users`;
    
 CREATE TABLE `Users` (
   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
   `username` VARCHAR(20) NOT NULL DEFAULT 'Anonymous',
   PRIMARY KEY (`id`)
 );

 -- ---
 -- Table 'Messages'
 -- 
 -- ---

 DROP TABLE IF EXISTS `Messages`;
    
 CREATE TABLE `Messages` (
   `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
   `text` VARCHAR(140) NOT NULL DEFAULT NULL,
   `id_Users` INTEGER NULL DEFAULT NULL,
   `id_Rooms` INTEGER NULL DEFAULT NULL,
   PRIMARY KEY (`id`)
 );

 -- ---
 -- Foreign Keys 
 -- ---

 ALTER TABLE `Messages` ADD FOREIGN KEY (id_Users) REFERENCES `Users` (`id`);
 ALTER TABLE `Messages` ADD FOREIGN KEY (id_Rooms) REFERENCES `Rooms` (`id`);

 -- ---
 -- Table Properties
 -- ---

 -- ALTER TABLE `Rooms` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
 -- ALTER TABLE `Users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
 -- ALTER TABLE `Messages` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

 -- ---
 -- Test Data
 -- ---

 -- INSERT INTO `Rooms` (`id`,`Roomname`) VALUES
 -- ('','');
 -- INSERT INTO `Users` (`id`,`username`) VALUES
 -- ('','');
 -- INSERT INTO `Messages` (`id`,`id_Users`,`id_Rooms`) VALUES
 -- ('','','');
