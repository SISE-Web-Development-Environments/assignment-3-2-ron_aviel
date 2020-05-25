
var express = require("express");
var router = express.Router();
const DButils = require("c:/Users/ronsh/assignment-3-2-ron_aviel/Codes/sqlconnect");
const bcrypt = require("bcrypt");



router.put('/deleteAllRecipes', (req, res) => {
	res.status(200).send("Hello World");
});

router.put('/deleteRecipeInMaking/:recipeId', (req, res) => {
	res.status(200).send("Hello World");
});

module.exports = router;