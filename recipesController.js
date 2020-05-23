var express = require('express');
const app = express();

app.get('/recipe/${id}', (req, res) => {
	res.status(200).send("Hello World");
});

app.get('/recipe/${name}', (req, res) => {
	res.status(200).send("Hello World");
});

app.get('/recipe/getRandomRecipes', (req, res) => {
	res.status(200).send("Hello World");
});

app.get('/recipe/getFamilyRecipes', (req, res) => {
	res.status(200).send("Hello World");
});

app.get('/recipe/getCreatedByUser/${userID}', (req, res) => {
	res.status(200).send("Hello World");
});

app.post('/recipe', (req, res) => {
	res.status(200).send("Hello World");
});

app.get('/user/login', (req, res) => {
	res.status(200).send("Hello World");
});

app.get('/user/logout', (req, res) => {
	res.status(200).send("Hello World");
});

app.get('/user/GetFavoriteRecipes/${id}', (req, res) => {
	res.status(200).send("Hello World");
});

app.get('/user/getLastSeen/${id}', (req, res) => {
	res.status(200).send("Hello World");
});

app.get('/user/getMeal/${userID}', (req, res) => {
	res.status(200).send("Hello World");
});

app.post('/user', (req, res) => {
	res.status(200).send("Hello World");
});

app.put('/user/updateLastSeenRecipes', (req, res) => {
	res.status(200).send("Hello World");
});

app.put('/user/updateFavoriteRecipes', (req, res) => {
	res.status(200).send("Hello World");
});

app.get('/recipeInMaking/${id}', (req, res) => {
	res.status(200).send("Hello World");
});

app.post('/recipeInMaking', (req, res) => {
	res.status(200).send("Hello World");
});

app.put('/recipeInMaking/${id}', (req, res) => {
	res.status(200).send("Hello World");
});

app.delete('/recipeInMaking/${id}', (req, res) => {
	res.status(200).send("Hello World");
});

app.put('/meal/deleteAllRecipes', (req, res) => {
	res.status(200).send("Hello World");
});

app.put('/user/deleteRecipeInMaking/${recipeId}', (req, res) => {
	res.status(200).send("Hello World");
});


const port = process.env.PORT || 5000; //environment variable
app.listen(port, () => {
	console.log(`Listening on portt ${port}`);
});