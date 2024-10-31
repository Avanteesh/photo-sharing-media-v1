CREATE DATABASE media_db;
Use media_db;

SET SQL_SAFE_UPDATES = off;

CREATE TABLE Albums(
   album_id VARCHAR(180) PRIMARY KEY,
   album_name VARCHAR(60),
   number_of_photos INT,
   creation_date DATETIME
);

CREATE TABLE user_post(
	post_id VARCHAR(180) PRIMARY KEY,
    post_title VARCHAR(140),
    post_image LONGBLOB,
    post_description VARCHAR(4000),
    post_date DATETIME,
    album_id VARCHAR(180),
    FOREIGN KEY(album_id) 
    REFERENCES Albums(album_id)
);

CREATE TABLE favourite_posts(
	post_id VARCHAR(180)
);

ALTER TABLE favourite_posts
ADD CONSTRAINT FOREIGN KEY(post_id) 
REFERENCES user_post(post_id);

SELECT * FROM user_post;



