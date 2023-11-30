const express = require('express')
const userRoutes = require('./routes/userRoutes')
const {redisConnection}= require('./configration/redisConfigration');
const env = require('dotenv');


env.config();

//creating server
const app = express();

//application level middileware
app.use(express.json());
app.listen(process.env.PORT, ()=> console.log("server is running on port 6006"))


//database connection
//db_connection();
redisConnection();

//all routes
app.use('/user', userRoutes);


//global error handler
//app.use(errorHandler)


//route for testing
app.get('/test', (req:any, res:any)=> res.send("all is working"))
