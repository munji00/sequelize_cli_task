const express = require('express')
const userRoutes = require('./routes/userRoutes')
//import db_connection from './utility/db_configration.js';
//import { port } from './configration/config.js';
//import userRoutes from './routes/userRoutes.js';
//import { errorHandler } from './handlers/errorHandler.js';
//import prodRoute from './routes/ecomProdRoutes.js';


//creating server
const app = express();

//application level middileware
app.use(express.json());
app.listen(6006, ()=> console.log("server is running on port 6006"))


//database connection
//db_connection();

//all routes
app.use('/user', userRoutes);
//app.use('/fetch' , prodRoute)


//global error handler
//app.use(errorHandler)


//route for testing
app.get('/test', (req, res)=>{
    res.send("all is working");
})
