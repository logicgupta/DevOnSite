const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const edge=require('express-edge');
const passport=require('passport');
const login=require('../Routes/login');
const auth=require('../Auth/auth');
const Blog=require('../Routes/insert');
const bodyParser=require('body-parser');
const TutOperation=require('../Routes/tutorial');
const multer=require('multer');
const authenticate=require('../Auth/auth');
const User=require('../Model/User');
const jwt=require('jsonwebtoken');


module.exports=function(app){

    app.use(express.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(require('express-edge'));
    //app.set('views', `${__dirname}/views`);
    app.use(express.static(path.join(__dirname,'./views')));
    app.use(passport.initialize());
    app.use(passport.session());
   
    app.get('/',(req,res)=>{
        res.render('home');
    });
    app.get('./html5/html5',(req,res)=>{
        res.render('html5');
    });
    app.get('./css3/css3',(req,res)=>{
        res.render('css3');
    });
    app.get('/home',(req,res)=>{
        res.render('home');
    });
    app.get('/csssyntax',(req,res)=>{
        res.render('csssyntax');
    });
    app.get('/cssintro',(req,res)=>{
        res.render('cssintro');
    });
    app.get('/css3/Signin',(req,res)=>{
        res.render('Signin');
    });
    app.get('/error',(req,res)=>{

        res.render('error');
    });

    app.get('/errorsignup',(req,res)=>{

        res.render('errorsignup');
    });
    
    app.get('/css3/Signup',(req,res)=>{
        res.render('Signup');
    });
    app.get('/signin',(req,res,next)=>{
        console.log('evd');
        passport.authenticate('local',(err,user,info)=>{
            if(err){
                res.statusCode=403;
                res.render('errorsignup');
                return;
             //   res.setHeader('Content-Type','application/json');
               // res.json({'success':'false','status':'Login Failed','err':err}); 
            }
            else if(!user){
                res.statusCode=403;
            
                res.render('errorsignup');
                return;
            //    res.setHeader('Content-Type','application/json');
              //  res.json({'success':'false','status':'Login Failed !','err':info}); 
            }
            req.logIn(user,(err)=>{
                if(err){
                  
                    res.statusCode = 403;
                    res.render('errorsignup');
                    return;
                  //  res.setHeader('Content-Type', 'application/json');
                   //  res.json({success: true, status: 'You are not logged in!','err':err});
                }
            });
            const token=jwt.sign({_id:req.user._id},"1212-1212-1212-1212");
            res.statusCode = 200;
           // res.setHeader('Content-Type', 'application/json');
            res.render('home');
          //  res.json({success: true, status: 'You are successfully logged in!','token':token});


        })(req,res,next);
    })
   
    app.post('/signup',(req,res,next)=>{
            console.log(req.body.username);
            const password=req.body.password;
            console.log(password)
            User.register(new User({username:req.body.username})
                ,password,(err,user)=>{
                    if(err){
                        console.log(err);
                        res.statusCode=403;
                       // res.setHeader('Content-Type','application/json');
                       // res.json({'success':'false','status':'Registration Failed!','err':err}); 
                        res.render('error');
                   
                    }
                    else{
                        console.log('Au')
                        passport.authenticate('local')(req,res,()=>{
                            res.statusCode=200;
                            res.render('home');
                            //res.setHeader('Content-Type','application/json');
                            //res.json({'success':'true','status':'Registration SuccessFull'}); 
                            
                           
                        });
    
                    }
                });
    });


    app.use('/blog',Blog);
    app.use('/admin',TutOperation);


};