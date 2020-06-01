

var express = require("express");
var router = express.Router();
const DButils = require("./sqlconnect");
const bcrypt = require("bcrypt");
const Recipes=require("./Recipes");
const recFunction =require("./recipe");
//hey hey aviel
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
    if(req.session.user_id==undefined)
      throw new Error("User not logged in");
  const favorites = (
      await DButils.execQuery(
        `SELECT favorites FROM users WHERE user_id = '${req.session.user_id}'`
      )
    )[0];  
    if(favorites.favorites===""){
      send("");
    }
    else{
    var userFavorites=JSON.parse(favorites.favorites);
    var recipes=new Array(userFavorites.length);
     for(var i=0;i<recipes.length;i++){
           const recipe =await recFunction.getRecipeInfo(userFavorites[i]);
           recipes[i]=recFunction.getDisplay(recipe,true,recFunction.isInLastSeen(recipe.id));
     }
    res.send({recipes});
    }
  }
   catch (error) {
    next(error);
  }
});

router.get('/getLastSeen', async (req, res,next) => {
  try{
  const lastseen = (
    await DButils.execQuery(
      `SELECT lastseen FROM users WHERE user_id = '${req.session.user_id}'`
    )
  )[0];
  if(lastseen.lastseen===""){
   throw { status: 401, message: "The LastSeen list is empty" };
  }
  let lastseens=JSON.parse(lastseen.lastseen);
  let recipes=new Array(lastseens.length);
   for(var i=0;i<recipes.length;i++){
          if(lastseens[i]!=-1 && lastseens[i]!=undefined){
         const recipe =await recFunction.getRecipeInfo(lastseens[i]);
          recipes[i]=recFunction.getDisplay(recipe);
          }
   }
  res.send({recipes});
  }
 catch (error) {
  next(error);
}
});



router.get('/getMeal', async (req, res) => {
  try{
    const meal = (
      await DButils.execQuery(
        `SELECT recipes_in_making FROM users WHERE user_id = '${req.session.user_id}'`
      )
    )[0];  
    if(meal.recipes_in_making===""){
        res.send({data:"empty"});
    }
    else{
        var userMeal=JSON.parse(meal.recipes_in_making);
        var recipes=new Array(userMeal.length);
         for(var i=0;i<recipes.length;i++){
               const recipe =await recFunction.getRecipeInMaking(userMeal[i]);
               recipes[i]=recFunction.data;
         }
        res.send({recipes});
    }
  }
  catch (error) {
    next(error);
  }

});



router.put('/updateLastSeenRecipes', async (req, res,next) => {
  try{
    const lastseen = (
      await DButils.execQuery(
        `SELECT lastseen FROM users WHERE user_id = '${req.session.user_id}'`
      )
    )[0];
    let id=req.body.id;
    const recipe =await recFunction.getRecipeInfo(id);// throw exception if not exist 
    let lastseens=new Array(1);
    if(lastseen.lastseen===""){
      lastseens[0]=id;
    } 
    else{
    lastseens=JSON.parse(lastseen.lastseen);
    lastseens=UpdateTheArray(id,lastseens);
    }
    const ans=await DButils.execQuery(
      `UPDATE users SET lastseen='${JSON.stringify(lastseens)}' WHERE user_id = '${req.session.user_id}'`
    )
    res.send({ success: true, message: "Last seen list has been updated " });
      }
      catch (error) {
        next(error);
      }

});
async function FindIfRecipeexist(id ,arr){
  for(let i=0;i<arr.length;i++){
      if(id===arr[i])
      return i;
  }
  return -1;
}

async function UpdateTheArray(id,arr){
  let index=FindIfRecipeexist(id,arr);
  if(index===-1)
    index=arr.length-1; 
  for(let i=0;i<index;i++){
      arr[i+1]=arr[i];
    }
  arr[0]=id;
  return arr;
}

router.put('/updateFavoriteRecipes', async(req, res,next) => {
  try{
    const favorites = (
      await DButils.execQuery(
        `SELECT favorites FROM users WHERE user_id = '${req.session.user_id}'`
      )
    )[0]; 
    if(favorites.favorites===""){
      let recipe=[req.body.recipe_id];
      const ans=await DButils.execQuery(
        `UPDATE users SET favorites='${JSON.stringify(recipe)}' WHERE user_id = '${req.session.user_id}'`
      )
    }
    else{
      let newFavorites=JSON.parse(favorites.favorites);
      newFavorites[newFavorites.length]=req.body.recipe_id;
      await DButils.execQuery(
        `UPDATE users SET favorites='${JSON.stringify(newFavorites)}' WHERE user_id = '${req.session.user_id}'`
      )
    }
        const user = (
        await DButils.execQuery(
          `SELECT favorites FROM users WHERE user_id = '${req.session.user_id}'`
        ))[0];
        res.send(user);
        
  }
  catch (error) {
    next(error);
  }
});//


module.exports = router;