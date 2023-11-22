const mongoose = require('mongoose');

function getCurrentTime(){
      let curDate = new Date();
      let day      = curDate.getDate();
      let month    = curDate.getMonth()+1;
      let year     = curDate.getFullYear();

      let hr       = curDate.getHours();
      let min      = curDate.getMinutes();
      let sec      = curDate.getSeconds();

      let fmt ='';
      if(hr>12){
        hr = hr-12;
        fmt="PM";
      }else {
        fmt='AM';
      }
     return day+"/"+month+"/"+year+" "+hr+":"+min+":"+sec+" "+fmt;

}
const foodSchema = mongoose.Schema({
    'food':{
        type:String,
        require:true
    },
    'description':{
        type:String,
        require:true
    },
    'price':{
        type:Number,
        require:true
    },
    'food_pic':{
        type:String,
        require:true
    },
   
},{versionKey:false});

module.exports = mongoose.model('foodModel',foodSchema,'foods');
console.log("food model is ready to use");
