require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");

// API:
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(`${process.env.NEWS_API_KEY}`);

let topic = "TEST TOPIC";

const getTopic = () => {
  newsapi.v2
    .topHeadlines({
      q: "new",
      category: "politics",
      language: "en",
      country: "us",
    })
    .then((response) => {
      topic = response.articles[0].title;
    })
    .catch((err) => console.log(err));

  console.log("getting topic");
};

// TOPIC:
getTopic();
setInterval(getTopic, 1000 * 60 * 60 * 24);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: `${process.env.SECRET}`,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// DB:
mongoose.connect(
  `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASS}@cluster0.k7bhq.mongodb.net/userDB`
);

const userSchema = new mongoose.Schema({
  alias: String,
  username: String,
  password: String,
  post: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Gets:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/posts", (req, res) => {
  if (req.isAuthenticated()) {
    User.find({ post: { $ne: null } }, (err, foundUsers) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUsers) {
          res.render("posts", {
            topic: topic,
            currentUser: req.user.alias,
            usersWithPost: foundUsers,
          });
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

// POSTS:
app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.logIn(user, (err) => {
    if (err) {
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/posts");
      });
    }
  });
});

app.post("/register", (req, res) => {
  User.register(
    { alias: req.body.alias, username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        currentUser = user;
        passport.authenticate("local")(req, res, () => {
          res.redirect("/posts");
        });
      }
    }
  );
});

app.post("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

app.post("/createPost", (req, res) => {
  let newPost = req.body.postInput;
  User.findById(req.user.id, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.post = newPost;
        foundUser.save(() => {
          res.redirect("/posts");
        });
      }
    }
  });
});

// Server:
app.listen(process.env.PORT || 3000, () => console.log("Spinning"));
