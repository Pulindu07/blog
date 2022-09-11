//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-pulindu:Pulli269@cluster0.2vtgg4r.mongodb.net/blogDB", { useNewUrlParser: true })
const postsSchema = {
  title: String,
  content: String
}

const Post = new mongoose.model("Post", postsSchema);

const homeStartingContent = "You can add post by going to the url: https://blogbypulindu.herokuapp.com/compose";
const aboutContent = "Hi I am Pulindu de Silva";
const contactContent = "Drop me an email: pulindujanith@gmail.com";

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", { StartingContent: homeStartingContent, posts: posts });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });

});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });

});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:target", function (req, res) {
  const target = req.params.target;
  Post.findOne({ _id: target }, function (err, post) {
    if (!err) {
      if (!post) {
        res.render("notFound");
        app.post("/notFound", function (req, res) {
          res.redirect("/");
        });
      } else {
        res.render("post", { postTitle: post.title, postContent: post.content });
      }
    }
  })
});

let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
    console.log("Network Up and Running on port 3000");

});
