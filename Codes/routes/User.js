
var express = require("express");
var router = express.Router();
const DButils = require("./sqlconnect");
const bcrypt = require("bcrypt");
const Recipies=require("./Recipes");


//#region cookie middleware
router.use(function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
        }
        next();
      })
      .catch((error) => next(error));
  } else {
    next();
  }
});
//#endregion


//User REST requests

router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    const users = await DButils.execQuery("SELECT username FROM users");

    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };
    // add the new username
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await DButils.execQuery(
      `INSERT INTO users VALUES (default, '${req.body.username}', '${req.body.firstname}' , '${req.body.lastname}','${req.body.country}',
      '${hash_password}','${req.body.email}','${req.body.photoLink}', "", "" ,"",0 ) ` 
    );
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    // check that username exists
    const users = await DButils.execQuery("SELECT username FROM users");
    if (!users.find((x) => x.username === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE username = '${req.body.username}'`
      )
    )[0];

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;
    // req.session.save();
    // res.cookie(session_options.cookieName, user.user_id, cookies_options);

    // return cookie
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});



router.get('/GetFavoriteRecipes', (req, res) => {
  const users = await DButils.execQuery("SELECT favorites FROM users");
  if (!users.find((x) => x.user_id === req.session.user_id))
    throw { status: 401, message: "User not logged in" };
  const favorites = (
      await DButils.execQuery(
        `SELECT favorites FROM users WHERE username = '${req.session.user_id}'`
      )
    )[0];  
    var userFavorites=JSON.parse(favorites);
    var recipes=new Array(userFavorites.length/2);
    for(var i=0,k=0,j=1;i<recipes.length;i=i+2,j=j+2,k++){
      if(userFavorites[j]==0){ //user
      const recipe = (
        await DButils.execQuery(
          `SELECT * FROM recipes WHERE recipe_id = '${userFavorites[i]}'`
        )
      )[0];  
      }
      else
        {
          const recipe =Recipies.getRecipeInfo(userFavorites[i]);
        }
            recipes[k]=recipe;
    }
});

router.get('/getLastSeen/:id', (req, res) => {
	res.status(200).send("Hello World");
});

router.get('/getMeal/:userID', (req, res) => {
  const meal = await DButils.execQuery('SELECT recipe_id,progression FROM recipes_in_making where user_id= '${req.body.username}'');
  if (!meal.find((x) => x.username === req.body.username))
    throw { status: 401, message: "Username or Password incorrect" };
});


router.put('/updateLastSeenRecipes', (req, res) => {
	res.status(200).send("Hello World");
});

router.put('/updateFavoriteRecipes', (req, res) => {
	res.status(200).send("Hello World");
});


module.exports = router;
