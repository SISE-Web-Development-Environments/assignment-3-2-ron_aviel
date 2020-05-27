
var express = require("express");
var router = express.Router();
const DButils = require("./sqlconnect");
const bcrypt = require("bcrypt");


//Recipe REST requsts

router.get('/:id', (req, res) => {
	res.status(200).send("Hello World");
});

router.get('/:name', (req, res) => {
	res.status(200).send("Hello World");
});

router.get('/getRandomRecipes', (req, res) => {
	res.status(200).send("Hello World");
});

router.get('/getFamilyRecipes', (req, res) => {
	res.status(200).send("Hello World");
});

router.get('/getCreatedByUser/:userID', (req, res) => {
	res.status(200).send("Hello World");
});

router.post('/', (req, res) => {
	res.status(200).send("Hello World");
});


module.exports = router;