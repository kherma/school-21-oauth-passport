// ================
// IMPORTS
// ================

const express = require("express");
const cors = require("cors");
const path = require("path");
const hbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const passportConfig = require("./config/passport");

// ================
// MIDDLEWARE
// ================

const app = express();

app.use(session({ secret: process.env.secret }));
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

app.use("/auth", require("./routers/auth.routes"));

app.use("/user", require("./routers/user.routes"));

app.use("/", (req, res) => {
  res.status(404).render("notFound");
});

// ================
// START SERVER
// ================

app.listen("8000", () => {
  console.log("Server is running on port: 8000");
});
