const jwt = require('jsonwebtoken');
function isLoggedIn(req,res,next){
    try{   
    jwt.verify(req.headers.token,'abcdSecretKey');
    }
    catch{
        return res.status(200).json({'message':'token backlisted'});

    }
    next();//-->Closure function which send the request to next available resources.

}

module.exports = isLoggedIn;
console.log('check-auth is working...');
