
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

router.get('/getRecipeDisplay',async(req,res,next) =>{
  try{
      const recipe=await getRecipeInfo(req.body.id);
      res.send(getDisplay(recipe));
  }
  catch (error) {
    next(error);
  }
});

router.get('/getRecipeFullDisplay',async(req,res,next) =>{
  try{
      const recipe=await getRecipeInfo(req.body.id);
      res.send(getFullDisplay(recipe));
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
      const info=await getRecipeInfo(id);
      random[i]=getDisplay(info);
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




module.exports=router;
