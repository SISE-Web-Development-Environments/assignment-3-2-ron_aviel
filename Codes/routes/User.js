
var express = require("express");
var router = express.Router();
const DButils = require("./sqlconnect");
const bcrypt = require("bcrypt");
const Recipes=require("./Recipes");


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
      '${hash_password}','${req.body.email}','${req.body.photoLink}', '', '' ,'',0 ) ` 
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



router.get('/GetFavoriteRecipes', async(req, res,next) => {
  try{
  const favorites = (
      await DButils.execQuery(
        `SELECT favorites FROM users WHERE user_id = '${req.session.user_id}'`
      )
    )[0];  
    //var userFavorites=JSON.parse(favorites);
    var userFavorites=[716429,1232];
    var recipes=new Array(userFavorites.length);
     for(var i=0;i<recipes.length;i++){
           const recipe =await Recipes.getRecipeInfo(userFavorites[i]);
           var recipeToReturn=new Object();
           recipeToReturn.photo=recipe.data.image;
           recipeToReturn.title=recipe.data.title;
           recipeToReturn.readyInMinutes=recipe.data.readyInMinutes;
           recipeToReturn.aggregateLikes=recipe.data.aggregateLikes;
           recipeToReturn.vegan=recipe.data.vegan;
           recipeToReturn.glutenFree=recipe.data.glutenFree;
           recipes[i]=recipeToReturn;
     }
    res.send({recipes});
  }
   catch (error) {
    next(error);
  }
});

router.get('/getLastSeen', async (req, res) => {
  try{
  const lastseen = (
    await DButils.execQuery(
      `SELECT lastseen FROM users WHERE user_id = '${req.session.user_id}'`
    )
  )[0];  
  //var lastseens=JSON.parse(lastseen);
  var lastseens=[716429,1232,2];
  var recipes=new Array(lastseens.length);
   for(var i=0;i<recipes.length;i++){
         const recipe =await Recipes.getRecipeInfo(lastseen[i]);
         var recipeToReturn=new Object();
         recipeToReturn.photo=recipe.data.image;
         recipeToReturn.title=recipe.data.title;
         recipeToReturn.readyInMinutes=recipe.data.readyInMinutes;
         recipeToReturn.aggregateLikes=recipe.data.aggregateLikes;
         recipeToReturn.vegan=recipe.data.vegan;
         recipeToReturn.glutenFree=recipe.data.glutenFree;
         recipes[i]=recipeToReturn;
   }
  res.send({recipes});
  }
 catch (error) {
  next(error);
}
	
});

router.get('/getMeal', async (req, res) => {

});


router.put('/updateLastSeenRecipes', async (req, res) => {
  try{
    const lastseen = (
      await DButils.execQuery(
        `SELECT lastseen FROM users WHERE user_id = '${req.session.user_id}'`
      )
    )[0];
    let id=req.body.recipe_id;
    const recipe =await Recipes.getRecipeInfo(id);
    // if not exist throw exception  throw { status: 401, message: "Username or Password incorrect" };
    //var lastseens=JSON.parse(lastseen);
    var lastseens=[716429,1232,2];
    lastseens[2]=lastseens[1];
    lastseens[1]=lastseens[0];
    lastseens[0]=id;// the input 
      }
      catch (error) {
        next(error);
      }

});

router.put('/updateFavoriteRecipes', async(req, res) => {
});


module.exports = router;
