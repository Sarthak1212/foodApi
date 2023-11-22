const jwt = require('jsonwebtoken');
function isAdmin(req,res, next){
    try{  
    var decoded = jwt.verify(req.headers.key,'abcdSecretKey');
    //user is admin
    req.headers['isAdmin']=decoded.isAdmin;
    
   

    }
    catch{
         //return res.status(200).json({'message':''})
    }
    next();
}

module.exports = isAdmin;

console.log('isAdmin is working');