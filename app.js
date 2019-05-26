const express=require('express');
const Joi=require('joi');
const path=require('path');
const expressedge=require('express-edge');
const app=express();
app.use(require('express-edge'));
//app.set('views', `${__dirname}/views`);
app.use(express.static(path.join(__dirname,'./views')));
require('./Mongoose/connect')();
require('./startup/dev')(app);
require('./startup/index')(app);
app.listen(process.env.PORT|3000,(ab)=>{ console.log('Server Running on Port '+ab);})