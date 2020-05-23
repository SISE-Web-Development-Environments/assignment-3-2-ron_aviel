//#region global imports
require("dotenv").config();
const apiaxios = require("axios");
//#region express configures
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
const cookies_options = {
  maxAge: 1000 * 60 * 15, // would expire after 15 minutes
  httpOnly: true, // The cookie only accessible by the web server
  signed: true // Indicates if the cookie should be signed
};
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(cookieParser(process.env.COOKIE_SECRET, cookies_options)); //Parse the cookies into the req.cookies
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files

var port = process.env.PORT || "3000";
//#endregion

const db = require("./db");

app.post("/users/Register", (req, res) => {
  // parameters exists
  // valid parameters
  // username exists
  if (db.users.find((x) => x.name === req.body.name))
    throw new Error("Name exists");
  // add the new username
  var newUser = { ...req.body, id: db.length };
  db.users.push(newUser);
  res.status(201).send("user created");
  // db.push(req.body)
});

app.post("/users/Login", (req, res) => {
  // check that username exists
  if (!db.users.find((x) => x.name === req.body.name))
    throw new Error("password or Name is not correct");
  // check that the password is correct
  var user = db.users.find((x) => x.name === req.body.name);
  if (req.body.password !== user.password) {
    throw new Error("password or Name is not correct");
  }

  // Set cookie
  res.cookie("cookieName", "cookieValue", cookies_options); // options is optional

  // return cookie
  res.status(200).send("login succeeded");
});
// get recipe by ID is Working !!!!!!!
app.get("/recipe/getRecipe", (req, res) => {
    // get id from client
    console.log(req.query.id);
    // axios: request spooncular 
    apiaxios.get(`https://api.spoonacular.com/recipes/${req.query.id}/information`,
     {params: {apiKey: process.env.spooncular_apiKey}})
     .then((result) => {
         // i can resend specific data also , the example is below 
         
         // vegeterian:result.data.vegeterain , vegan:result.data.vegan  instead of result.data .
        // res.send(result.data); // whole data example 
         const u_result={
            vegeterian:result.data.vegeterain ,
            vegan:result.data.vegan
         }
         res.send (u_result);
        });
    });

app.use((err, req, res, next) => {
  console.log(err.message);

  res.status(500).json({
    message: err.message
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});