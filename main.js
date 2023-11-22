//create an webserver using express
const express = require('express');
const cors    = require('cors');

const port = 3000;

//consuming the userrouter
const userRouter = require('./routes/user.route');
const foodRouter = require('./routes/food.route');

const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));
app.use('/users',userRouter);
app.use('/foods',foodRouter);

app.get('/',(req,res)=>{
    res.send("<h1>Welcome to Express Web Server</h1>");
});

app.listen(port,()=>{
    console.log(`Server has started at ${port}`);
});
