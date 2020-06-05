
var express = require("express");
var router = express.Router();
const axios = require("axios");
const recFunction =require("./recipe");
const DButils = require("./sqlconnect");

const api_domain = "https://api.spoonacular.com/recipes";


router.get("/Information", async (req, res, next) => {
  try {
    const recipe = await recFunction.getRecipeInfo(req.query.recipe_id);
    res.send({ data: recipe.data });
  } catch (error) {
    next(error);
  }
});

//#region example1 - make serach endpoint
router.get("/search", async (req, res, next) => {
  try {
    const { query, cuisine, diet, intolerances, number } = req.query;
    const search_response = await axios.get(`${api_domain}/search`, {
      params: {
        query: query,
        cuisine: cuisine,
        diet: diet,
        intolerances: intolerances,
        number: number,
        instructionsRequired: true,
        apiKey: process.env.spooncular_apiKey
      }
    });
    let recipes = await Promise.all(
      search_response.data.results.map((recipe_raw) =>
        recFunction.getDisplay(recFunction.getRecipeInfo(recipe_raw.id))
      )
    );
    recipes = recipes.map((recipe) => recipe.data);
    if(req.session.user_id!=undefined){
      const lastSearch=await DButils.execQuery(
        `UPDATE users SET last_search='${query}' WHERE user_id = '${req.session.user_id}'`
      )
    }
      res.send({ data: recipes});
  } catch (error) {
    next(error);
  }
});

//#endregion

router.get('/getRecipeDisplay',async(req,res,next) =>{
  try{
      const recipe=await recFunction.getRecipeInfo(req.body.id);
      res.send(recFunction.getDisplay(recipe,recFunction.isInFavorites,recFunction.isInLastSeen));
  }
  catch (error) {
    next(error);
  }
});

router.get('/getRecipeFullDisplay',async(req,res,next) =>{
  try{
      const recipe=await recFunction.getRecipeInfo(req.body.id);
      res.send(recFunction.getFullDisplay(recipe));
  }
  catch (error) {
    next(error);
  }
});

router.get('/getRandomRecipes', async(req,res,next) =>{
  try{
    const search_response = await axios.get(`${api_domain}/random`, {
      params: {
        limitLicense:false,
        number:3,
        apiKey: process.env.spooncular_apiKey
      }
    });
    var random=new Array(3);
    for(var i=0;i<3;i++){
      const recipe=await search_response.data.recipes[i];
      var id=recipe.id;
      const info=await recFunction.getRecipeInfo(id);
      if(req.session.user_id==undefined)
      random[i]=recFunction.getDisplay(info,false,false);
      else
      random[i]=recFunction.getDisplay(info,await recFunction.isInFavorites(id,req.session.user_id),await recFunction.isInLastSeen(id,req.session.user_id));
    }
    res.send({random});
  }
  catch (error) {
    next(error);
  }
});


router.get('/getFamilyRecipes', async(req,res,next) =>{
  try{
    const family = (
      await DButils.execQuery(
      'SELECT * FROM recipes'
      )
    );  
    res.send({family});
  }
  catch (error) {
    next(error);
  }
});

router.get('/getRecipeMaking/:id',(req, res,next) => {
  try{  
      res.send(recFunction.getRecipeInMaking(id));
  }
 catch (error) {
  next(error);
}
});




module.exports=router;
