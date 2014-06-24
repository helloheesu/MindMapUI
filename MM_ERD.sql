show databases;
use mm_db;

ALTER DATABASE mm_db
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

-- -----------------------------------------------------
-- Drop Tables
-- -----------------------------------------------------
DROP TABLE IF EXISTS `log_node` ;
DROP TABLE IF EXISTS `log_activity` ;
DROP TABLE IF EXISTS `genealogy` ;
DROP TABLE IF EXISTS `user` ;
DROP TABLE IF EXISTS `node` ;

-- -----------------------------------------------------
-- Create Table `node`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `node` (
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`));

-- -----------------------------------------------------
-- Create Table `user`
-- -----------------------------------------------------
###### INDEX 가 좀 고민된다. id 로 할지, email 이나 이름으로 할지..
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `head_id` INT NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  INDEX `fk_head_node_idx` (`head_id` ASC),
  CONSTRAINT `fk_head_node`
    FOREIGN KEY (`head_id`)
    REFERENCES `node` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- -----------------------------------------------------
-- Create Table `genealogy`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `genealogy` (
  `parent_id` INT NOT NULL,
  `child_id` INT NOT NULL,
  PRIMARY KEY (`parent_id`, `child_id`),
  INDEX `fk_child_idx` (`child_id` ASC),
  CONSTRAINT `fk_parent`
    FOREIGN KEY (`parent_id`)
    REFERENCES `node` (`id`),
  CONSTRAINT `fk_child`
    FOREIGN KEY (`child_id`)
    REFERENCES `node` (`id`));

-- -----------------------------------------------------
-- Create Table `log_activity`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `log_activity` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL NULL,
  `time` TIMESTAMP,
  `activity` VARCHAR(200),
  PRIMARY KEY (`id`),
  INDEX `fk_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`id`));

-- -----------------------------------------------------
-- Create Table `log_node`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `log_node` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `node_id` INT NOT NULL,
  `time` TIMESTAMP NULL,
  `content` VARCHAR(200) NULL,
  `authority` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_node_idx` (`node_id` ASC),
  CONSTRAINT `fk_node`
    FOREIGN KEY (`node_id`)
    REFERENCES `node` (`id`));

SHOW TABLES;
SELECT * FROM node;
SELECT * FROM user;
SELECT * FROM log_node;
SELECT * FROM log_activity;
SELECT * FROM genealogy;



-- -----------------------------------------------------
-- Create (노드 생성)
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS sp_create_new_node_id;
DELIMITER $$
CREATE PROCEDURE sp_create_new_node_id(
  IN input_content VARCHAR(200), IN input_authority VARCHAR(45), IN input_time TIMESTAMP, OUT result_node_id INT)
BEGIN
  DECLARE selected_node INT;
  
  START TRANSACTION;
    INSERT INTO node VALUES (NULL);     # HEAD NODE 로 빈 노드 생성
    SET selected_node = LAST_INSERT_ID(); # INSERT 된 ID 값을 받아서 저장한다
    
    INSERT INTO log_node (node_id, time, authority, content) VALUES (selected_node, NOW(), input_authority, input_content);
    SET result_node_id = selected_node;

    COMMIT;
  
END $$
DELIMITER ;

SET @new_head = NULL;
CALL sp_create_new_node_id('안녕heLlow', 'ONLYME', NOW(), @new_head);
SELECT @new_head;
SELECT * FROM log_node WHERE node_id=@new_head;
SELECT * FROM log_node;

-- -----------------------------------------------------
-- Register (회원가입)
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS sp_register;
DELIMITER $$
CREATE PROCEDURE sp_register (
  IN input_email VARCHAR(45), IN input_passwd VARCHAR(45), IN input_name VARCHAR(45), OUT result VARCHAR(45))
BEGIN
  DECLARE email_exists INT;
  DECLARE selected_node INT;
  DECLARE selected_user INT;

  START TRANSACTION;    
    SET email_exists = NULL;
    SELECT id INTO email_exists FROM user WHERE email=input_email;

    IF email_exists IS NULL THEN
      SET @created_haed_id = NULL;
      CALL sp_create_new_node_id(input_name, 'ALL', NOW(), @created_head_id);
      INSERT INTO user (head_id, email, password, name) VALUES (@created_head_id, input_email, MD5(input_passwd), input_name);
      SET selected_user = LAST_INSERT_ID();
      
      INSERT INTO log_activity (user_id, time, activity) VALUES (selected_user, NOW(), 'REGISTER');
      
      SET result = "REGISTER SUCCESS";
      
      COMMIT;

    ELSE
      SET result = "ALREADY EXSISTING ID";
      COMMIT; # COMMIT? ROLLBACK? 롤백하면 result 가 제대로 반환될까?
          # 지금보니 TRANSACTION 의 필요성 자체에 회의. 모듈적이니까 다 해야하는 거 같기도 하고.. --> 그래서 일단 create 부터 뺌.
    END IF;

END $$
DELIMITER ;

SET @output_result = NULL;
CALL sp_register('hoho@naver.org', 'passtestword', '새로운이름', @output_result);
SELECT * FROM user;
SELECT * FROM log_activity;
SELECT * FROM node;
SELECT * FROM log_node;



-- -----------------------------------------------------
-- login (로그인)
-- -----------------------------------------------------
DROP PROCEDURE IF EXISTS sp_login;
DELIMITER $$
CREATE PROCEDURE sp_login(
  IN input_email VARCHAR(45), IN input_passwd VARCHAR(45), OUT result VARCHAR(45))
BEGIN
  DECLARE selected_id VARCHAR(45);
  DECLARE selected_pw VARCHAR(45);
  DECLARE selected_authority INT;

  START TRANSACTION;
  
  SELECT id INTO selected_id FROM user WHERE email = input_email;
  IF selected_id is NULL THEN
    SET result = "ID NOT FOUND";
    COMMIT;

  ELSE
    SELECT authority INTO selected_authority FROM log_node INNER JOIN user ON log_node.node_id=user.head_id WHERE user.email='hㅑ@nhn.2rg' ORDER BY log_node.id DESC LIMIT 1;
    IF selected_authority='DELETED' THEN
      INSERT INTO log_activity (user_id, time, activity) VALUES (selected_id, NOW(), "LOGIN - REJECTED");
      SET result = "LEFT MEMBER";
      COMMIT;
    
    ELSE
    SELECT password INTO selected_pw FROM user WHERE email = input_email;

      IF selected_pw <> MD5(input_passwd) THEN
        INSERT INTO log_activity (user_id, time, activity) VALUES (selected_id, NOW(), "LOGIN - WRONG PASSWORD");
        SET result = "WRONG PASSWORD";
        COMMIT;
      
      ELSE
        INSERT INTO log_activity (user_id, time, activity) VALUES (selected_id, NOW(), "LOGIN - SUCCESS");
        SET result = "LOGIN SUCCESS, WELCOME";
        # SET @current_user = selected_id;
        COMMIT;
      END IF;
    END IF;
  END IF;
END $$
DELIMITER ;

SELECT * FROM user;
SET @output_result = NULL;
CALL sp_login('123@nhn.2rg', 'heowlrowl', @output_result);
SELECT @output_result;
CALL sp_login('hㅑ@nhn.2rg', 'WEF', @output_result);
SELECT @output_result;
CALL sp_login('hㅑ@nhn.2rg', 'heowlrowl', @output_result);
SELECT @output_result;



-- -----------------------------------------------------
-- Leave (회원탈퇴)
-- -----------------------------------------------------
# 회원탈퇴에서는 유효한 회원인지(존재하는 id, 비 탈퇴회원) 체크 안 해도 될 거 같은데...
# 이미 로그인 할 때 체크했고 그걸 세션에 남길테니까....
# --> 그래서 crate 부터는 알 수 있다는 가정하에, in param 으로 head id 바로 넘김.

DROP PROCEDURE IF EXISTS sp_leave;
DELIMITER $$
CREATE PROCEDURE sp_leave(
  IN input_email VARCHAR(45), IN input_passwd VARCHAR(45), OUT result VARCHAR(45))
BEGIN
  DECLARE selected_id VARCHAR(45);
  DECLARE selected_pw VARCHAR(45);
  DECLARE selected_head_id INT;

  START TRANSACTION;
  
  SELECT id INTO selected_id FROM user WHERE email = input_email;
  IF selected_id is NULL THEN
    SET result = "ID NOT FOUND";
    COMMIT;
  
  ELSE
    SELECT password INTO selected_pw FROM user WHERE email = input_email;

    IF selected_pw <> MD5(input_passwd) THEN
      INSERT INTO log_activity (user_id, time, activity) VALUES (selected_id, NOW(), "LEAVE - WRONG PASSWORD");
      SET result = "WRONG PASSWORD";
      COMMIT;
    
    ELSE
      SELECT head_id INTO selected_head_id FROM user WHERE id=selected_id; 
      INSERT INTO log_node (node_id, time, authority) VALUES (selected_head_id, NOW(), "DELETED");
      INSERT INTO log_activity (user_id, time, activity) VALUES (selected_id, NOW(), "LEAVE - SUCCESS");
      SET result = "LEAVE SUCCESS, GOOD BYE";
      # SET @current_user = NULL;
      COMMIT;
    END IF;
  END IF;
END $$
DELIMITER ;

SET @output_result = NULL;
CALL sp_leave('123@nhn.2rg', 'heowlrowl', @output_result);
SELECT @output_result;
CALL sp_leave('hㅑ@nhn.2rg', 'WEF', @output_result);
SELECT @output_result;
CALL sp_leave('hㅑ@nhn.2rg', 'heowlrowl', @output_result);
SELECT @output_result;

SELECT * FROM user;
SELECT * FROM log_activity;
SELECT * FROM log_node;


