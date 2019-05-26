const bodyParser=require('body-parser');
const express=require('express');
const multer=require('multer');
const tutroute=express.Router();
const Tutorial=require('../Model/Tutorial');
const passport=require('passport');

    tutroute.use(bodyParser.json());
    tutroute.use(bodyParser.urlencoded({extended:true}));


    const storage=multer.diskStorage({
        destination(req,file,cb){
            cb(null,'public/tutImages');
        },
        filename(req,file,cb){
            cb(null,file.originalname);
        } 
    });

    const upload=multer({storage:storage});


    tutroute.post('/postTutorialWithoutImage',passport.authenticate('jwt',{session:false}),(req,res)=>{

        const tut=new Tutorial({
                tutorial_admin:req.user._id,
                tutorial_type:req.body.tutorial_type,
                tutorial_content:req.body.tutorial_content,
        });

        tut.save((err,details)=>{

            if(err){

                res.statusCode=500;
                res.header('Content-Type','application/json');
                res.json({'status':false,'err':err,'details':null});
            }
            else{
                res.statusCode=200;
                res.header('Content-Type','application/json');
                res.json({'status':true,'err':null,'details':details});
            }
        });
    });

    
    tutroute.post('/postTutorialWithImage',upload.single('image'),(req,res)=>{

        const tut=new Tutorial({
                tutorial_admin:req.user._id,
                tutorial_type:req.body.tutorial_type,
                tutorial_content:req.body.tutorial_content,
                tutorial_image:req.path.file
        });

        tut.save((err,details)=>{

            if(err){

                res.statusCode=500;
                res.header('Content-Type','application/json');
                res.json({'status':false,'err':err,'details':null});
            }
            else{
                res.statusCode=200;
                res.header('Content-Type','application/json');
                res.json({'status':true,'err':null,'details':details});
            }
        });
    });

    tutroute.get('/getAllTutorial',(req,res)=>{


        Tutorial.find({},(err,details)=>{
            if(err){
                    res.statusCode=500;
                    res.header('Content-Type','application/json');
                    res.json({'status':false,'err':err,'details':null});
            }
            else{
                res.statusCode=200;
                res.header('Content-Type','application/json');
                res.json({'status':true,'err':null,'details':details});

            }
        });
    });

    
    tutroute.get('/getTutorialByType',(req,res)=>{


        Tutorial.findOne({tutorial_type:req.body.tutorial_type},(err,details)=>{
            if(err){
                    res.statusCode=500;
                    res.header('Content-Type','application/json');
                    res.json({'status':false,'err':err,'details':null});
            }
            else{
                res.statusCode=200;
                res.header('Content-Type','application/json');
                res.json({'status':true,'err':null,'details':details});
            }
        });
    });


    
    tutroute.put('/postupdate',(req,res)=>{

       Tutorial.findByIdAndUpdate({_id:req.body._id},req.body,(err,details)=>{

        if(err){
            res.statusCode=500;
            res.header('Content-Type','application/json');
            res.json({'status':false,'err':err,'details':'Failed To Update '});
        }
        else{
            res.statusCode=200;
            res.header('Content-Type','application/json');
            res.json({'status':true,'err':null,'details':'SucessFully Updated'});
        }
       });

       
    });

    tutroute.delete('/deleteupdate',(req,res)=>{

        Tutorial.findByIdAndRemove({_id:req.body._id},(err,details)=>{
 
         if(err){
             res.statusCode=500;
             res.header('Content-Type','application/json');
             res.json({'status':false,'err':err,'details':'Failed To Delete '});
         }
         else{
             res.statusCode=200;
             res.header('Content-Type','application/json');
             res.json({'status':true,'err':null,'details':'SucessFully Deleted'});
         }
        });
 
        
     });
 
    module.exports=tutroute;