require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true
}

const localURL = "mongodb://localhost:27017/userDB";

mongoose.connect(localURL, mongooseOptions);


const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Encoding

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {
  res.render("home");
});

app.route("/login")
  .get(function(req, res) {
    res.render("login");
  })
  .post(function(req, res) {
    User.findOne({email:req.body.username}, function(err, user) {
      if (err) {
        console.log(err);
      } else {
        if (user) {
          bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (result === true) {
              res.render("secrets");
            }
          });
        }
      }
    });
  });

app.route("/register")
  .get(function(req, res) {
    res.render("register");
  })
  .post(function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const newUser = new User({
        email: req.body.username,
        password: hash
      });
      newUser.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          res.render("secrets");
        }
      });
    });
  });

app.get("/submit", function(req, res) {
  res.render("submit");
});

app.listen(3000, function() {
  console.log("Server running on port 3000.");
});
