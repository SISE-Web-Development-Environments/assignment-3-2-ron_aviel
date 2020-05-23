// class Recipe{
//     constructor(id,photo,name,shipDate,cookingTime,vegan,gluttenFree,popularity,ingridients,meals,userId){
//         this.id=id;
//         this.photo=photo;
//         this.name=name;
//         this.shipDate=shipDate;
//         this.cookingTime=cookingTime;
//         this.vegan=vegan;
//         this.gluttenFree=gluttenFree;
//         this.popularity=popularity;
//         this.ingridients=ingridients;
//         this.meals=meals;
//         this.userId=userId;
//     }
// }
var express = require("./node_modules/express");
var router = express.Router();
const axios = require("./node_modules/axios");

const api_domain = "https://api.spoonacular.com/recipes";

router.get("/", (req, res) => res.send("im here"));

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

function getRecipeInfo(id) {
  return axios.get(`${api_domain}/${id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey
    }
  });
}

module.exports = router;
