
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
    let recipes=search_response.data.results;
    let recipesArr=new Array(recipes.length);
    for(let i=0;i<recipes.length;i++){
      let favorites;
      let lastSeen;
      if(req.session.user_id==undefined){
        favorites=false;
        lastSeen=false;
      }
      else{
         favorites=await recFunction.isInFavorites(recipes[i].id,req.session.user_id);
         lastSeen=await recFunction.isInLastSeen(recipes[i].id,req.session.user_id);
      }
      let recipe=await recFunction.getRecipeInfo(recipes[i].id);
      recipesArr[i]=await recFunction.getDisplay(recipe,favorites,lastSeen);
    }
    if(req.session.user_id!=undefined){
      const lastSearch=await DButils.execQuery(
        `UPDATE users SET last_search='${query}' WHERE user_id = '${req.session.user_id}'`
      )
    }
      res.send({ data: recipesArr});
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
      let favorites;
      let lastSeen;
      if(req.session.user_id==undefined){
         favorites=false;
         lastSeen=false;
      }
      else{
       favorites=await recFunction.isInFavorites(req.body.id,req.session.user_id);
       lastSeen=await recFunction.isInLastSeen(req.body.id,req.session.user_id);
      }
      let ans= await recFunction.getFullDisplay(recipe,favorites,lastSeen);
      var instructions=await axios.get(`${api_domain}/${req.body.id}/analyzedInstructions`,{
        params: {
          stepBreakdown: false,
          apiKey: process.env.spooncular_apiKey
        }
      });
      res.send({recipe:ans,instructions:instructions.data});
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
    res.send({random:recipes});
  }
  catch (error) {
    next(error);
  }
});


router.get('/getFamilyRecipes', async(req,res,next) =>{
  try{
    if(req.session.user_id==undefined){
      res.send({});
    }
    else{
    const family = (
      await DButils.execQuery(
      `SELECT * FROM familyRecipes WHERE user_id = '${req.session.user_id}'`
      )
    );  
    res.send({family});
    }
  }
  catch (error) {
    next(error);
  }
});

router.get('/getPersonalRecipes', async(req,res,next) =>{
  try{
    if(req.session.user_id==undefined){
      res.send({});
    }
    else{
    const personal = (
      await DButils.execQuery(
      `SELECT * FROM personalRecipes WHERE user_id = '${req.session.user_id}'`
      )
    );  
    res.send({personal});
    }
  }
  catch (error) {
    next(error);
  }
});

router.get('/getRecipeMaking', async(req, res,next) => {
  try{  
      const recipe=await recFunction.getRecipeInMaking(req.body.id);
      res.send({recipe:recipe.data});
  }
 catch (error) {
  next(error);
}
});




module.exports=router;
