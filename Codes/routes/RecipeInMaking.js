


var express = require("express");
var router = express.Router();
const DButils = require("c:/Users/ronsh/assignment-3-2-ron_aviel/Codes/sqlconnect");
const bcrypt = require("bcrypt");


//RecipeInMaking REST requests

router.get('/:id:', (req, res) => {
	res.status(200).send("Hello World");
});

router.post('/', (req, res) => {
	res.status(200).send("Hello World");
});

router.put('/:id', (req, res) => {
	res.status(200).send("Hello World");
});

router.delete('/:id', (req, res) => {
	res.status(200).send("Hello World");
});


module.exports = router;