var express = require("express");
var router = express.Router();
const DButils = require("./sqlconnect");
const bcrypt = require("bcrypt");
const recFunction =require("./recipe");


router.get('/getMeal', async (req, res) => {
  try{
    if(req.session.user_id==undefined)
        throw new Error("User not logged in");
    const meal = (
      await DButils.execQuery(
        `SELECT recipes_in_making FROM users WHERE user_id = '${req.session.user_id}'`
      )
    )[0];  
    if(meal.recipes_in_making===""){
        res.send({data:"empty"});
    }
    else{
        var userMeal=JSON.parse(meal.recipes_in_making);
        var recipes=new Array(userMeal.length);
         for(var i=0;i<recipes.length;i++){
               const recipe =await recFunction.getRecipeInMaking(userMeal[i]);
               recipes[i]=recipe.data;
         }
        res.send({recipes});
    }
  }
  catch (error) {
    next(error);
  }
});




 function FindIfRecipeexist(id ,arr){
  for(let i=0;i<arr.length;i++){
      if(id==arr[i])
        return i;
  }
  return -1;
}

 function UpdateTheArray(id,arr){
  let index=FindIfRecipeexist(id,arr);
  if(index==-1)
      index =arr.length;
  for(let i=index;i>0;i--){
      arr[i]=arr[i-1];
      }
  arr[0]=id;
  return arr;
 }


router.put('/addToMeal', async(req, res,next) => {
  try{
    if(req.session.user_id==undefined)
    throw new Error("User not logged in");
    const meal = (
      await DButils.execQuery(
        `SELECT recipes_in_making FROM users WHERE user_id = '${req.session.user_id}'`
      )
    )[0];  
    if(meal.recipes_in_making===""){
      let recipe=[req.body.recipe_id];
      const ans=await DButils.execQuery(
        `UPDATE users SET recipes_in_making='${JSON.stringify(recipe)}' WHERE user_id = '${req.session.user_id}'`
      )
  }
    else{
      let newMeal=JSON.parse(meal.recipes_in_making);
      newMeal[newMeal.length]=req.body.recipe_id;
      await DButils.execQuery(
        `UPDATE users SET recipes_in_making='${JSON.stringify(newMeal)}' WHERE user_id = '${req.session.user_id}'`
      )
    }
        const user = (
        await DButils.execQuery(
          `SELECT recipes_in_making FROM users WHERE user_id = '${req.session.user_id}'`
        ))[0];
        res.send(user);
        
  }
  catch (error) {
    next(error);
  }
});
router.put('/switchMealOrder',async(req, res,next) => {
  try{
    if(req.session.user_id==undefined)
    throw new Error("User not logged in");
    const mealsarray = (
      await DButils.execQuery(
        `SELECT meal_array FROM users meals user_id = '${req.session.user_id}'`
      )
    )[0];
   // const recipe =await recFunction.getRecipeInfo(id);// throw exception if not exist 
    
    if(mealsarray.meal_array===""){
      throw new Error("the meal is empty so you cant switch between recipes ");
    } 
    else{
    mealsarr=JSON.parse(mealsarray.meal_array);
    if(mealsarr.length===1)
        throw new Error("the meal is only 1 recipe  so you cant switch between recipes ");
    let temp=req.body.id1;
    mealsarr[req.body.id1]=req.body.id2;
    mealsarr[req.body.id2]=temp;
    }
    const ans=await DButils.execQuery(
      `UPDATE meals SET meals_array='${JSON.stringify(mealsarr)}' WHERE user_id = '${req.session.user_id}'`
    )
    // const anss=await DButils.execQuery(
    //   `UPDATE users SET mealsamount='${JSON.stringify(lastseens)}' WHERE user_id = '${req.session.user_id}'`
    // )
    res.send(mealsarr);
      }
      catch (error) {
        next(error);
      }
    });
  router.put('/switchRecipeToFirst',async(req, res,next) => {
    try{
      if(req.session.user_id==undefined)
      throw new Error("User not logged in");
      const mealsarray = (
        await DButils.execQuery(
          `SELECT meal_array FROM users meals user_id = '${req.session.user_id}'`
        )
      )[0];
      let id=req.body.id;
     // const recipe =await recFunction.getRecipeInfo(id);// throw exception if not exist 
      let mealsarr=new Array(1);
      if(mealsarray.meal_array===""){
       mealsarr[0]=id;
      } 
      else{
      mealsarr=JSON.parse(mealsarray.meal_array);
       mealsarr=UpdateTheArray(id,mealsarr);
      }
      const ans=await DButils.execQuery(
        `UPDATE meals SET meals_array='${JSON.stringify(mealsarr)}' WHERE user_id = '${req.session.user_id}'`
      )
      // const anss=await DButils.execQuery(
      //   `UPDATE users SET mealsamount='${JSON.stringify(lastseens)}' WHERE user_id = '${req.session.user_id}'`
      // )
      res.send(mealsarr);
        }
        catch (error) {
          next(error);
        }
      });


router.delete('/deleteMeal', async(req, res,next) => {
  try{
    if(req.session.user_id==undefined)
    throw new Error("User not logged in");
    const ans=await DButils.execQuery(
      `UPDATE users SET favorites='',meal_amount=0 WHERE user_id = '${req.session.user_id}'`
    )
        
  }
  catch (error) {
    next(error);
  }
});


module.exports = router;