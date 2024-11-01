/*
 photo-gallery app
 author '@' avanteesh
 date: October 30th 2024
*/
const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const dotenv = require("dotenv");

const app = express();
const PORT = 5354;
dotenv.config();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true, limit: '12mb'}));
app.set("view engine", "ejs");

const db_connection = mysql.createPool({
  user: process.env.user,
  password: process.env.password,
  host: process.env.localhost,
  database: process.env.database
}).promise();

async function query_db(querystr)  {
  const result = await db_connection.query(querystr).then((res) => {
    return res.at(0);
  }).catch((error) => {
    return error.message;
  });
  return result;
}

function dateTimeDifference(init_date)  {
  const now = new Date();
  const difference = Math.abs(now - init_date)/1000;
  const DAYS_IN_SEC = 86400;
  const MONTH_TO_SEC = DAYS_IN_SEC*30;
  return (
    (difference < 60)? `${difference} seconds ago`:
    (difference >= 60 && difference < 3600)?`${Math.floor(difference/60)} minutes ago`:
    (difference >= 3600 && difference < DAYS_IN_SEC)? `${Math.floor(difference/3600)} hours ago`:
    (difference >= DAYS_IN_SEC && difference < MONTH_TO_SEC)?
    `${Math.floor(difference/86400)} days ago`:
    (difference >= MONTH_TO_SEC && difference < 12*MONTH_TO_SEC)?
    `${Math.floor(difference/MONTH_TO_SEC)} months ago`:
    `${Math.floor(difference/(12*MONTH_TO_SEC))} years ago` 
  );
}

app.listen(PORT, function()  {
  console.log(`Server running at Port: ${PORT}`);
});

app.get("/", async function(req, res)  {
  const media_data = await query_db(`SELECT post_id,post_title,post_image,
  post_description,post_date FROM user_post;`);
  res.render("page", {media_data});
});

app.get("/delete-post/:post_id", async function(req, res)  {
  const _delete_from_album = await query_db(`DELETE from favourite_posts
  where post_id = '${req.params.post_id}';`);
  const _delete_post = await query_db(`DELETE FROM user_post 
  WHERE post_id = '${req.params.post_id}'`);
  const media_data = await query_db(`SELECT post_id,post_title,post_image,
  post_description,post_date FROM user_post;`);
  res.render("page", {media_data});
});

app.post("/new-post", async function(req, res)  {
  const {image_buffer,post_title,post_description,
  post_date} = req.body;
  let post_id = `${post_title.split(/ \s*/g).join("")}${post_date}`;
  const _query_ = await query_db(`insert into user_post(post_id,post_title,
  post_image,post_description,post_date)values('${post_id}','${post_title}',
  '${image_buffer}','${post_description}','${post_date}');`);
});

app.post("/add-to-favourites", async function(req, res)  {
  const favourite_post = req.body.post_id;
  const _add_as_favourite = await query_db(`insert into favourite_posts(post_id)
  values('${favourite_post}');`);
  const media_data = await query_db(`select post_id,post_title,post_image,
  post_description,post_date FROM user_post;`);
  res.render("page", {media_data});
});

app.get("/view-post/:post_id", async function(req, res)  {
  const _post_id = req.params.post_id;
  const post_content = await query_db(`select post_title,post_image,post_description,
  post_date from user_post where post_id = '${_post_id}';`);
  const {post_title,post_image,post_description,post_date} = post_content.at(0);
  const imageBuffer = Array.from(post_image).map(function(token) {
    return String.fromCharCode(token);
  }).join("");
  const time_difference = dateTimeDifference(post_date);
  res.render("postview",{
    post_title,imageBuffer,
    post_description,
    time_difference
  });
});



