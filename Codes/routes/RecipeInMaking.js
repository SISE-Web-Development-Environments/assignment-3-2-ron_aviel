// class recipesInMaking{
//     constructor(id,name,steps,progression){
//         this.id=id;
//         this.name=name;
//         this.steps=steps;
//         this.progression=progression;
//     }
// }


var express = require("express");
var router = express.Router();
const DButils = require("c:/Users/ronsh/assignment-3-2-ron_aviel/Codes/sqlconnect");
const bcrypt = require("bcrypt");


//RecipeInMaking REST requests

app.get('/:id:', (req, res) => {
	res.status(200).send("Hello World");
});

app.post('/', (req, res) => {
	res.status(200).send("Hello World");
});

app.put('/:id', (req, res) => {
	res.status(200).send("Hello World");
});

app.delete('/:id', (req, res) => {
	res.status(200).send("Hello World");
});


module.exports = router;