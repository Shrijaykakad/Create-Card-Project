if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer');
const {storage} = require("./cloudConfig.js");
const upload = multer({ storage });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));

let users = [];

//Home Route
app.get("/home", (req, res) => {
  res.render("home.ejs", {users});
});

//Create Route
app.get("/home/create", (req, res) => {
  res.render("create.ejs");
})

app.put("/home/create", upload.single('img'), (req, res) => {
  let url = req.file.path;
  let file = req.file.name;
  // console.log(req.file);
  req.body.id = uuidv4();
  req.body.img = url;
  req.body.img_file = file;
  users.push(req.body);
  res.redirect("/home");
})

//Edit Route
app.get("/home/:id/edit", (req, res) => {
  let {id} = req.params;
  let editUser = users.find((user) =>
    user.id === id
) || {};
res.render("edit.ejs", {editUser});
})

app.patch("/home/:id", upload.single('img'), (req, res) => {
  let { id } = req.params;
  let editUser = users.find((user) =>
    user.id === id
  ) || {};
  editUser.name = req.body.name;
  editUser.job = req.body.job;
  editUser.likes = req.body.likes;
  editUser.comments = req.body.comments;
  editUser.shares = req.body.shares;
  if(req.file){
    editUser.img = req.file.path;
    editUser.img_file = req.file.name;
  }
  res.redirect("/home");
})

//Delete Route
app.delete("/home/:id/delete", (req, res) => {
  let { id } = req.params;
  let delUser = users.filter((user) => id !== user.id);
  users = delUser;
  res.redirect("/home");
})

app.listen(port, () => {
  console.log("listening to port 8080");
})