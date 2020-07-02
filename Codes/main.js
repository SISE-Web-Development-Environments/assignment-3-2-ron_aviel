require("dotenv").config();
//#region express configures
var cors =require("cors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const session = require("client-sessions");
const DButils = require("./routes/sqlconnect");
var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
app.use(
  session({
    cookieName: "session", // the cookie key name
    secret: process.env.COOKIE_SECRET, // the encryption key
    duration: 20 * 60 * 1000, // expired after 20 sec
    activeDuration: 0 // if expiresIn < activeDuration,
    //the session will be extended by activeDuration milliseconds
  })
);
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files

// const corsConfig = {
//   origin: true,
//   credentials: true
// };

app.use(cors());
// app.options("*", cors(corsConfig));

var port = process.env.PORT || "5000";
//#endregion
const user = require("./routes/User");
const recipe = require("./routes/Recipes");
const meal = require("./routes/Meal");



app.use("/user", user);
app.use("/Recipes", recipe);
app.use("/Meal", meal);


app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).send({ message: err.message, success: false });
});

const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

process.on("SIGINT", function () {
  if (server) {
    server.close(() => console.log("server closed"));
  }
  process.exit();
});