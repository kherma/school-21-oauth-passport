// ================
// IMPORTS
// ================

const express = require("express");
const cors = require("cors");
const path = require("path");
const hbs = require("express-handlebars");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

// ================
// MIDDLEWARE
// ================

const app = express();

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "828506271918-cccqujqu2hcg6ap1p7p3s6d3jqnstg6r.apps.googleusercontent.com",
      clientSecret: "djxTnhqDyxIroxKKMLaZUqLG",
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

// serialize user when saving to session
passport.serializeUser((user, serialize) => {
  serialize(null, user);
});

// deserialize user when reading from session
passport.deserializeUser((obj, deserialize) => {
  deserialize(null, obj);
});

app.use(session({ secret: "!T1r1y2T3o5H8a1c3k2M1e$" }));
app.use(passport.initialize());
app.use(passport.session());

app.engine(
  "hbs",
  hbs({ extname: "hbs", layoutsDir: "./layouts", defaultLayout: "main" })
);
app.set("view engine", ".hbs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));

// ================
// ENDPOINTS
// ================

app.get("/", (req, res) => {
  res.render("index");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/user/no-permission" }),
  (req, res) => {
    res.redirect("/user/logged");
  }
);

app.get("/user/logged", (req, res) => {
  res.render("logged");
});

app.get("/user/no-permission", (req, res) => {
  res.render("noPermission");
});

app.use("/", (req, res) => {
  res.status(404).render("notFound");
});

// ================
// START SERVER
// ================

app.listen("8000", () => {
  console.log("Server is running on port: 8000");
});
