
var express = require("express");
var router = express.Router();
const axios = require("axios");

const api_domain = "https://api.spoonacular.com/recipes";


router.get("/Information", async (req, res, next) => {
  try {
    const recipe = await getRecipeInfo(req.query.recipe_id);
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
        getRecipeInfo(recipe_raw.id)
      )
    );
    recipes = recipes.map((recipe) => recipe.data);
    res.send({ data: recipes });
  } catch (error) {
    next(error);
  }
});
//#endregion

router.get('/getRecipeDisplay/:id',(req,res,next) =>{
  try{
      res.send(getDisplay(getRecipeInfo(id)));
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
      var id=search_response.data.recipes[i].id;
      random[i]=getDisplay(getRecipeInfo(id));
    }
    res.send({random});
  }
  catch (error) {
    next(error);
  }
});

router.get('/getRecipeMaking/:id',(req, res,next) => {
  try{  
      res.send(getRecipeInMaking(id));
  }
 catch (error) {
  next(error);
}
});


function getRecipeInfo(id) {
  return axios.get(`${api_domain}/${id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey
    }
  });
}


function getRecipeInMaking(id){
  return axios.get(`${api_domain}/${id}/analyzedInstructions`, {
    params: {
      stepBreakdown: false,
      apiKey: process.env.spooncular_apiKey
    }
  });
}

function getDisplay(recipe,favorites,lastSeen){
  var recipeToReturn=new Object();
  recipeToReturn.id=recipe.data.id;
  recipeToReturn.photo=recipe.data.image;
  recipeToReturn.title=recipe.data.title;
  recipeToReturn.readyInMinutes=recipe.data.readyInMinutes;
  recipeToReturn.aggregateLikes=recipe.data.aggregateLikes;
  recipeToReturn.vegan=recipe.data.vegan;
  recipeToReturn.glutenFree=recipe.data.glutenFree;
  if(favorites)
    recipeToReturn.favorites="true";
  else
    recipeToReturn.favorites="false";
  if(lastSeen)
    recipeToReturn.lastSeen="true";
  else
    recipeToReturn.lastSeen="false";
  return recipeToReturn;
}

function getFullDisplay(recipe){
  var recipeToReturn=getDisplay(recipe);
  recipeToReturn.servings=recipe.data.servings;
  recipeToReturn.analyzedInstructions=recipe.data.analyzedInstructions;
  recipeToReturn.extendedIngredients=recipe.data.extendedIngredients;
  return recipeToReturn
}
module.exports = {router,getRecipeInfo,getDisplay,getRecipeInMaking,getFullDisplay};
module.exports=router;
