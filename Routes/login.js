const express=require('express');
const bodyParser=require('body-parser');
const multer=require('multer');
const authenticate=require('../Auth/auth');
const loginRouter=express.Router();
const passport=require('passport');
const User=require('../Model/User');
const jwt=require('jsonwebtoken');

    loginRouter.route('/signup')
    .post((req,res)=>{
        console.log("SignUp");
        User.register(new User({username:req.body.username,firstname:req.body.firstname})
            ,req.body.password,(err,user)=>{
                if(err){
                    res.statusCode=403;
                    res.setHeader('Content-Type','application/json');
                    res.json({'success':'false','status':'Registration Failed!','err':err}); 
               
                }
                else{
                    console.log('Au')
                    passport.authenticate('local')(req,res,()=>{
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json({'success':'true','status':'Registration SuccessFull'}); 
                        res.render('/ho')
                    });

                }
            });
    });

 loginRouter.get('/signin',(req,res,next)=>{
        passport.authenticate('local',(err,user,info)=>{
            if(err){
                res.statusCode=403;
                res.setHeader('Content-Type','application/json');
                res.json({'success':'false','status':'Login Failed','err':err}); 
            }
            else if(!user){
                res.statusCode=403;
                res.setHeader('Content-Type','application/json');
                res.json({'success':'false','status':'Login Failed !','err':info}); 
            }
            req.logIn(user,(err)=>{
                if(err){
                  
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                     res.json({success: true, status: 'You are not logged in!','err':err});
                }
            });
            const token=jwt.sign({_id:req.user._id},"1212-1212-1212-1212");
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'You are successfully logged in!','token':token});

        })(req,res,next);

    });
module.exports=loginRouter;