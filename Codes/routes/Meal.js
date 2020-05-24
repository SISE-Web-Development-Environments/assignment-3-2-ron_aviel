// class Meal{
//     constructor(id,recipesInMeal){
//         this.id=id;
//         this.recipesInMeal=recipesInMeal;
//     }
// }

var express = require("express");
var router = express.Router();
const DButils = require("c:/Users/ronsh/assignment-3-2-ron_aviel/Codes/sqlconnect");
const bcrypt = require("bcrypt");



app.put('/deleteAllRecipes', (req, res) => {
	res.status(200).send("Hello World");
});

app.put('/deleteRecipeInMaking/:recipeId', (req, res) => {
	res.status(200).send("Hello World");
});

module.exports = router;