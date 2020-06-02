
var express = require("express");
const DButils = require("./sqlconnect");
const bcrypt = require("bcrypt");
const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";

//Recipe REST requsts

function getRecipeInfo(id) {
	return axios.get(`${api_domain}/${id}/information`, {
	  params: {
		includeNutrition: false,
		apiKey: process.env.spooncular_apiKey
	  }
	});
  }
  
  
  function getRecipeInMaking(id){
	return axios.get(`${api_domain}/${id}/analyzedInstructions`, {
	  params: {
		stepBreakdown: false,
		apiKey: process.env.spooncular_apiKey
	  }
	});
  }
  
  function getDisplay(recipe,favorites,lastSeen){
	var recipeToReturn=new Object();
	recipeToReturn.id=recipe.data.id;
	recipeToReturn.photo=recipe.data.image;
	recipeToReturn.title=recipe.data.title;
	recipeToReturn.readyInMinutes=recipe.data.readyInMinutes;
	recipeToReturn.aggregateLikes=recipe.data.aggregateLikes;
	recipeToReturn.vegan=recipe.data.vegan;
	recipeToReturn.glutenFree=recipe.data.glutenFree;
	if(favorites)
	  recipeToReturn.favorites="true";
	else
	  recipeToReturn.favorites="false";
	if(lastSeen)
	  recipeToReturn.lastSeen="true";
	else
	  recipeToReturn.lastSeen="false";
	return recipeToReturn;
  }
  
  function getFullDisplay(recipe){
	var recipeToReturn=getDisplay(recipe);
	recipeToReturn.servings=recipe.data.servings;
	recipeToReturn.analyzedInstructions=recipe.data.analyzedInstructions;
	recipeToReturn.extendedIngredients=recipe.data.extendedIngredients;
	return recipeToReturn
  }


   async function isInFavorites(id,next){
	try{
	  const favorites = (
		  await DButils.execQuery(
			`SELECT favorites FROM users WHERE user_id = '${req.session.user_id}'`
		  )
		)[0];  
		if(favorites.favorites===""){
		  return false;
		}
		else{
		var userFavorites=JSON.parse(favorites.favorites);
		 for(var i=0;i<userFavorites.length;i++){
			if(userFavorites[i]===id)
			  return true;
		 }
	}
	  return false;
	}
	catch (error) {
	  next(error);
	}
  }
  
  async function isInLastSeen(id,next){
	try{
	  const favorites = (
		  await DButils.execQuery(
			`SELECT lastseen FROM users WHERE user_id = '${req.session.user_id}'`
		  )
		)[0];  
		if(lastseen.lastseen===""){
		  return false;
		}
		else{
		let userLastSeen=JSON.parse(lastseen.lastseen);
		 for(let i=0;i<userLastSeen.length;i++){
			if(userLastSeen[i]===id)
			  return true;
		 }
	}
	  return false;
	}
	catch (error) {
	  next(error);
	}
  }

  module.exports = {getRecipeInfo,getDisplay,getRecipeInMaking,getFullDisplay,isInLastSeen,isInFavorites};

