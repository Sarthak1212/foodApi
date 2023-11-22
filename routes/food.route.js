const express = require('express');

const foodRouter = express.Router();

//consuming the check-auth middleware.
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const multer = require('multer');

//consuming the model.
const foodModel = require('../model/food.model');
const base_url = require('../model/base_url');
const uploadStorage = multer.diskStorage({
    destination:'public/assets/foods/',
    filename: (req,file,cb)=>{
        cb(null,file.originalname+"-"+Date.now()+".jpg");

    }
});

const uploadObj = multer({storage:uploadStorage});

//all food related api will goes here...
foodRouter.post('/add',[checkAuth,checkAdmin],uploadObj.single('food_pic'),(req,res)=>{
   if(req.headers.isAdmin) {      
    let newFood = new foodModel({
            'food':req.body.food,
            'description':req.body.desc,
            'price':req.body.price,
            'food_pic': base_url+"/assets/foods/"+req.file.filename
        });
        newFood.save()
               .then((insertedFoodInfo)=>{
                res.status(200).json(insertedFoodInfo);
               })
               .catch((error)=>{
                if(error) res.status(200).json(error);
               })
            }else {
                res.status(200).json({'message':'you dont have permission to perform this task'});
                
            }
});


foodRouter.get('/list',checkAuth,(req,res)=>{
      foodModel.find({}).exec()
               .then((foodData)=>{
                res.status(200).json(foodData);
               })
               .catch((error)=>{
                if(error) res.status(200).json(error);
               });
});

foodRouter.get('/list/:id',checkAuth,(req,res)=>{
    foodModel.findOne({'_id':req.params.id})
             .exec()
             .then((foodData)=>{
                if(!foodData)
                   res.status(200).json({'message':'no such food found'});
                else 
                   res.status(200).json(foodData);
             })
             .catch((error)=>{
                if(error) res.status(200).json(error);
             });
});
module.exports = foodRouter;

console.log('food router is ready to use');
