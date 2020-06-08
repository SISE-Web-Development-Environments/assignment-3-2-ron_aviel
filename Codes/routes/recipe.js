
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
	recipeToReturn.favorites=favorites;
	recipeToReturn.lastseen=lastSeen;
	return recipeToReturn;
  }
  
	function getFullDisplay(recipe,favorites,lastSeen){
	let favorite=favorites;
	let lastseen=lastSeen
	var recipeToReturn=getDisplay(recipe,favorite,lastseen);
	recipeToReturn.servings=recipe.data.servings;
	recipeToReturn.extendedIngredients=recipe.data.extendedIngredients;
	return recipeToReturn;
  }


  async function isInFavorites(id,user_id,next,req,res){
	try{
	  const favorites = (
		  await DButils.execQuery(
			`SELECT favorites FROM users WHERE user_id = '${user_id}'`
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
	catch (err) {
		console.error(err);
	}
  }
  
  async function isInLastSeen(id,user_id,next,req,res){
	try{
	  const lastseen = (
		  await DButils.execQuery(
			`SELECT lastseen FROM users WHERE user_id = '${user_id}'`
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
	catch (err) {
		console.error(err);
	}
  }



  module.exports = {getRecipeInfo,getDisplay,getRecipeInMaking,getFullDisplay,isInLastSeen,isInFavorites};

