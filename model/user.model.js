//Create a Mongoose Schema 
const mongoose = require("mongoose");

const userCollectionSchema = mongoose.Schema({
     
     'name':{
        type:String,
        require:true,
        
     },
     'email':{
        type:String,
        require:true,
        unique:true
     },
     'phone':{
      type:String,
      require:true,
      unique:true
     },
     'profile_pic':{
      type:String,
      require:true
     },
     'pass1':{
        type:String,
        require:true
     },
     'role':{
      type:String,
      default :'regular'
     }
},{versionKey:false});//It will not createn __v any more.

//mongoose.model('Virtula name',SchemaObject,Collection);
module.exports = mongoose.model('userModel',userCollectionSchema,'users');
console.log("User Model is Ready to Use");
