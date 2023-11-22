//load the mongoose lib
//Global Database Connection file.
const mongoose = require('mongoose');

//Testing the local Database Server with Mongoose.
 const db="mongodb://localhost:27017/userDB";
//connecting to remote DB server mongo atlas
//const db='mongodb+srv://satindra:admin123@food-api-cluster.e1tsv8e.mongodb.net/usersDB';

var con= mongoose.connect(db)
        .then(()=>{
            console.log('Successfully connected to mongodb');
        })
        .catch((error)=>{
            if(error) console.log(error);
        });

module.exports = con;
        