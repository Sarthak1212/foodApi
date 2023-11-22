const express= require('express');
const userRouter = express.Router();
const db_connect = require('../db/connect');
//Consuming the Model.
const userModel = require("../model/user.model");
//loading the multer lib.
const multer = require('multer');
//loading base_url
const base_url = require("../model/base_url");
//loading the bcryptjs
const bcrypt = require("bcryptjs");
//loading the json webtoken .
const jwt = require('jsonwebtoken');



function hashPass(pass1){
    
    var salt = bcrypt.genSaltSync(10);
    var hashPassword = bcrypt.hashSync(pass1, salt);
    return hashPassword;
}
function checkPass(dbPass,userPass){
    // Load hash from your password DB.
    var isChecked = bcrypt.compareSync(userPass,dbPass); // either true or false.
    return isChecked;
}
const storage = multer.diskStorage({
    destination:'public/uploads/',
    filename:(req,file,cb)=>{
           cb(null,file.fieldname+"-"+Date.now()+".jpg");
    }
});

const uploadObj = multer({storage:storage});

//All User Signup,SignIn Routes will goes here 
userRouter.get('/list',(req,res)=>{
    //res.status(200).json('userlist');
    userModel.find({})
            .exec()
            .then((userInfo)=>{
                res.status(200).json(userInfo);
            })
            .catch((error)=>{
                if(error) res.status(200).json(error);
            });
});
userRouter.post('/signup',uploadObj.single('avatar'),(req,res)=>{
          //res.status(200).json({"data":req.body,'file':req.file});
         
 const um = new userModel({
    'name': req.body.name,
    'email':req.body.email,
    'phone':req.body.phone,
    'profile_pic':base_url+"/uploads/"+req.file.filename,
    'pass1':hashPass(req.body.pass1)
   });
   um.save()
     .then((userData)=>{
        res.status(200).json(
            {'message':'user signup successfully done',
            'sumittedData':userData
           });

     })
     .catch((error)=>{
        if(error) {
            if(error.keyPattern.email)
               res.status(200).json({'message':'email already registered'});
            else if(error.keyPattern.phone)
               res.status(200).json({'message':'Phone number is already registered with us !'});
            else 
               res.status(200).json({'message':error});

        }
     });



});
//Adding signin routes
userRouter.post('/signin',(req,res)=>{
       userModel.findOne({'email':req.body.email})
                .exec()
                .then((userInfo)=>{
                    if(!userInfo)
                      res.status(200).json({'message':'user doesnot exists !'});
                    else{
                        //res.status(200).json(userInfo); 
                        let db_pass = userInfo.pass1;
                        let isValid = checkPass(db_pass,req.body.pass1);
                        if(isValid){
                            var isAdmin = false;
                            if(userInfo.role =='admin')
                               isAdmin=true;

                            //User successfully LOgged In,
                            //Then generate the json token.
                            let token = jwt.sign(
                                        {'isAdmin':isAdmin},
                                        'abcdSecretKey',
                                        {expiresIn:'1h'}
                              );
                              //This going to be visible to user front end .
                              res.status(200).json({
                                 'message':'success',
                                 'userInfo':userInfo,
                                 'token':{'key':token,'type':'bearer'}
                              });



                        }
                           
                        else
                           res.status(200).json({'message':'Wrong Cridentials !!'});

                    }
                })
                .catch((error)=>{
                    if(error) res.status(200).json(error);

                });

});
//adding the delete routes
userRouter.delete('/del/:id',(req,res)=>{
        userModel.deleteOne({'_id':req.params.id})
                 .then((deletedUserInfo)=>{
                    if(deletedUserInfo.deletedCount==1)
                       res.status(200).json({'message':'One User Profile has been removed'});
                    else 
                       res.status(200).json({'message':'Unable to delete User Profile'});
                    
                 })
                 .catch((error)=>{});
});
//updating user information depends on id.
userRouter.all('/edit/:id',uploadObj.single('avatar'),(req,res)=>{
      if(req.method =='PUT' || req.method=='PATCH'){
           userModel.updateOne({'_id':req.params.id},{$set:{
                'name':req.body.name,
                'phone':req.body.phone,
                'email':req.body.email,
                'profile_pic':base_url+"/"+req.file.filename,
                'pass1':hashPass(req.body.pass1)
           }})
           .then((userModifiedData)=>{
               //res.status(200).json(userModifiedData);
               if(userModifiedData.modifiedCount ==1)
                  res.status(200).json({'message':'User profile Updated'});
               else 
                  res.status(200).json({'message':'unable to update'});

            })
           .catch((error)=>{
              if(error) res.status(200).json(error);
           });

      }else{
        res.status(200).json({'message':'This Method doesnot supported'});

      }
});

module.exports= userRouter;
console.log('user router is ready to use');
