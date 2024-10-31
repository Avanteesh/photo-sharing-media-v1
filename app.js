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

app.listen(PORT, function()  {
  console.log(`Server running at Port: ${PORT}`);
});

app.get("/", async function(req, res)  {
  const media_data = await query_db(`SELECT post_id,post_title,post_image,
  post_description,post_date FROM user_post;`);
  res.render("page", {media_data});
});

app.get("/delete-post/:post_id", async function(req, res)  {
  const _delete_post = await query_db(`DELETE FROM user_post 
  WHERE post_id = '${req.params.post_id}'`);
  const media_data = await query_db(`SELECT post_id,post_title,post_image,
  post_description,post_date FROM user_post;`);
  res.render("page", {media_data});
});

app.post("/new-post", async function(req, res)  {
  const {image_buffer,post_title,post_description,
  post_date} = req.body;
  let post_id = `${post_title}${post_date}`;
  const _query_ = await query_db(`insert into user_post(post_id,post_title,
  post_image,post_description,post_date)values('${post_id}','${post_title}',
  '${image_buffer}','${post_description}','${post_date}');`);
});

app.post("/add-to-favourites", async function(req, res)  {
  const favourite_post = req.body.post_id;
  const _add_as_favourite = await query_db(`insert into favourite_post(post_id)
  WHERE post_id = '${favourite_post}'`);
});




