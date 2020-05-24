
var express = require("express");
var router = express.Router();
const DButils = require("c:/Users/ronsh/assignment-3-2-ron_aviel/Codes/sqlconnect");
const bcrypt = require("bcrypt");


//Recipe REST requsts

app.get('/:id', (req, res) => {
	res.status(200).send("Hello World");
});

app.get('/:name', (req, res) => {
	res.status(200).send("Hello World");
});

app.get('/getRandomRecipes', (req, res) => {
	res.status(200).send("Hello World");
});

app.get('/getFamilyRecipes', (req, res) => {
	res.status(200).send("Hello World");
});

app.get('/getCreatedByUser/:userID', (req, res) => {
	res.status(200).send("Hello World");
});

app.post('/', (req, res) => {
	res.status(200).send("Hello World");
});


module.exports = router;