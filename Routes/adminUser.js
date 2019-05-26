const mongoose=require('mongoose');
const passport=require('passport');
const auth=require('../Auth/auth');
const User=require('../Model/User');
const express=require('express');
const bodyParser=require('body-parser');
const adminLogin=express.Router();

adminLogin.use(bodyParser.json());
adminLogin.use(bodyParser.urlencoded({ extended:false}));

    /*
    *       Register Admin *--------------------------------------------------------------------------------
    */

    adminLogin.post('/register',(req,res)=>{

        User.register(new User({username:req.body.username,admin:true}),req.body.passport,(err,user)=>{
            if(err){
                res.statusCode=401;
                res.header('Conetnt-Type','application/json');
                res.json({'success':false,'err':err});
            }
            if(!user){
                res.statusCode=401;
                res.header('Conetnt-Type','application/json');
                res.json({'success':false,'status':'Registraton Failed !'});
            }
            else{
            passport.authenticate('local',(req,res)=>{
                res.statusCode=200;
                res.header('Conetnt-Type','application/json');
                res.json({'success':false,'status':'Registration SucessFull'});
            });
            }
        });
    });

    /*
    *           Login Admin User *----------------------------------------------------------------------------------------------
    */

    adminLogin.get('/adminLogin',(req,res,next)=>{


        passport.authenticate('local',(err,user,info)=>{
            if(err){
                res.statusCode=401;
                res.header('Conetnt-Type','application/json');
                res.json({'success':false,'err':err});
            }
            if(!user){
                res.statusCode=401;
                res.header('Conetnt-Type','application/json');
                res.json({'success':false,'status':'Login Failed !','err':info});
            }
            req.logIn(user,(err)=>{
                if(err){
                    res.statusCode=401;
                    res.header('Conetnt-Type','application/json');
                    res.json({'success':false,'err':err});
                }
            });

            if(req.user.admin===true){
            const token=jwt.sign({_id:req.user._id},"1212-1212-1212-1212");
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'You are successfully logged in!','token':token});
            }
            else{
                res.statusCode=401;
                res.header('Conetnt-Type','application/json');
                res.json({'success':false,'err':'You are not Admin User'});
            }
        });

    });


    module.exports=adminLogin;


