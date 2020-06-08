var express = require("express");
var router = express.Router();
const DButils = require("./sqlconnect");
const bcrypt = require("bcrypt");
const recFunction =require("./recipe");


router.get('/getMeal', async (req, res,next) => {
  try{
    if(req.session.user_id==undefined)
        throw new Error("User not logged in");
    const meal = (
      await DButils.execQuery(
        `SELECT meal_array FROM meals WHERE user_id = '${req.session.user_id}'`
      )
    )[0];  
    if(meal.meal_array===""){
        res.send({data:"empty"});
    }
    else{
        let userMeal=JSON.parse(meal.meal_array);
        let recipes=new Array(userMeal.length);
         for(let i=0;i<recipes.length;i++){
                const info=await recFunction.getRecipeInfo(userMeal[i]);
               const recipe =await recFunction.getDisplay(info,false,false);
               recipes[i]=recipe;
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
        `SELECT meal_array FROM meals WHERE user_id = '${req.session.user_id}'`
      )
    )[0];
    let recipe;
    if(meal.meal_array===""){
      recipe=[req.body.recipe_id];
      }
    else{
      recipe=JSON.parse(meal.meal_array);
      recipe[recipe.length]=req.body.recipe_id;
    }
    await DButils.execQuery(
      `UPDATE meals SET meal_array='${JSON.stringify(recipe)}' WHERE user_id = '${req.session.user_id}'`
    )  
        res.send({recipe:recipe});    
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
        `SELECT meal_array FROM meals where user_id = '${req.session.user_id}'`
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
    let temp=mealsarr[req.body.id1];
    mealsarr[req.body.id1]=mealsarr[req.body.id2];
    mealsarr[req.body.id2]=temp;
    }
    const ans=await DButils.execQuery(
      `UPDATE meals SET meal_array='${JSON.stringify(mealsarr)}' WHERE user_id = '${req.session.user_id}'`
    )

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
          `SELECT meal_array FROM meals where user_id = '${req.session.user_id}'`
        )
      )[0];
     
     // const recipe =await recFunction.getRecipeInfo(id);// throw exception if not exist 
      let mealsarr;
      if(mealsarray.meal_array===""){
        throw new Error("the meal is empty so you cant switch between recipes ");
      } 
      else{
       
      mealsarr=JSON.parse(mealsarray.meal_array);
      let id=mealsarr[req.body.id];
       mealsarr=UpdateTheArray(id,mealsarr);
      }
      const ans=await DButils.execQuery(
        `UPDATE meals SET meal_array='${JSON.stringify(mealsarr)}' WHERE user_id = '${req.session.user_id}'`
      )

      res.send(mealsarr);
        }
        catch (error) {
          next(error);
        }
      });


      router.delete('/deleteRecipeFromMeal', async(req, res,next) => {
        try{
          if(req.session.user_id==undefined)
          throw new Error("User not logged in");
          const mealsarray = (
            await DButils.execQuery(
              `SELECT meal_array FROM meals where user_id = '${req.session.user_id}'`
            )
          )[0];
        
          if(mealsarray.meal_array===""){
            throw new Error("the meal is empty so you cant switch between recipes ");
          } 
          let recipe=JSON.parse(mealsarray.meal_array);
          let index=FindIfRecipeexist(req.body.id,recipe);
          if(index===-1){
              res.send({data:"recipe doesnt exist"})
          }
          else{
            let newRecipes=new Array(recipe.length-1);
            let count=0;
            for(let i=0;i<recipe.length;i++){
                if(i==index)
                    continue;
                newRecipes[count]=recipe[i];
                count++;
            }
            const ans=await DButils.execQuery(
                `UPDATE meals SET meal_array='${JSON.stringify(newRecipes)}' WHERE user_id = '${req.session.user_id}'`
              )
            res.send({data:newRecipes});
          }
          
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
      `UPDATE meals SET meal_array=''WHERE user_id = '${req.session.user_id}'`
    )
    res.send({data:"meal deleted"});
  }
  catch (error) {
    next(error);
  }
});
module.exports = router;