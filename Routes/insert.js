const mongoose=require('mongoose');
const express=require('express');
const bodyParser=require('body-parser');
const config=require('config');
const passport=require('passport');
const authenticate=require('../Auth/auth');
const UserBlog=require('../Model/UserBlog');   
const multer=require('multer');

    const blogRoute=express.Router();
    blogRoute.use(bodyParser.json());
    blogRoute.use(bodyParser.urlencoded({extended:true}));

    const storage=multer.diskStorage({
        destination(req,file,cb){
            cb(null,'public/images');
        },
        filename(req,file,cb){
            cb(null,file.originalname);
        }
    });

    var upload=multer({storage:storage});

    
    blogRoute.post('/postBlogWithoutImage',passport.authenticate('jwt', { session: false }),(req,res)=>{

        console.log(req.body);
        const blog=new UserBlog.Blog({post_title:req.body.post_title,
            post_type:req.body.post_type,
            post_content:req.body.post_content,
            post_user:req.user._id
        });

        blog.save((err,b)=>{
            if(err){
                res.statusCode=500;
                res.header('Content-Type','application/json');
                res.json({'sucess':true,'details':null,'err':err});
            }
            else{
                res.statusCode=200;
                res.header('Content-Type','application/json');
                res.json({'sucess':true,'details':b,'err':false});
            }
        })
    
    });

    blogRoute.post('/postBlogWithImage',passport.authenticate('jwt', { session: false }),upload.single('postImage'),(req,res)=>{

        const blog=new UserBlog.Blog({post_title:req.body.post_title,
            post_type:req.body.post_type,
            post_content:req.body.post_content,
            post_user:req.user._id,
            post_image:req.file.path
        });

        blog.save((err,b)=>{
            if(err){
                res.statusCode=500;
                res.header('Content-Type','application/json');
                res.json({'sucess':false,'details':null,'err':err});
            }
            else{
                res.statusCode=200;
                res.header('Content-Type','application/json');
                res.json({'sucess':true,'details':b,'err':false});
            }
        });
    
    });
                /*
                            Like Count -*************************************************************************
                */
    blogRoute.post('/postLike',passport.authenticate('jwt', { session: false }),(req,res)=>{

        const blog=new UserBlog.Blog.findOneAndUpdate({_id:req.body._id}
            ,{$inc:{post_like_count:1}},(err,result)=>{
                if(err){
                    res.statusCode=500;
                    res.header('Content-Type','application/json');
                    res.json({'sucess':false,'details':null,'err':err});
                }
                else{
                    res.statusCode=200;
                    res.header('Content-Type','application/json');
                    res.json({'sucess':true,'details':result,'err':false});
                }

        });
    });

    blogRoute.post('/deleteLike',passport.authenticate('jwt', { session: false }),(req,res)=>{

        const blog=new UserBlog.Blog.findOneAndUpdate({_id:req.body._id}
            ,{$dec:{post_like_count:1}},(err,result)=>{
                if(err){
                    res.statusCode=500;
                    res.header('Content-Type','application/json');
                    res.json({'sucess':false,'details':null,'err':err});
                }
                else{
                    res.statusCode=200;
                    res.header('Content-Type','application/json');
                    res.json({'sucess':true,'details':result,'err':false});
                }

        });
    });

    blogRoute.get('/getBlog',(req,res)=>{

        UserBlog.Blog.find({},(err,result)=>{
            if(err){
                res.statusCode=500;
                res.header('Content-Type','application/json');
                res.json({'sucess':false,'details':null,'err':err});
            }
            else{
                res.statusCode=200;
                res.header('Content-Type','application/json');
                res.json({'sucess':true,'details':result,'err':null});
            }
        })
    });

    blogRoute.delete('/deleteBlog',passport.authenticate('jwt', { session: false }),(req,res)=>{

            UserBlog.Blog.deleteOne({_id:req.user._id},(err)=>{

                if(err){
                    res.statusCode=500;
                    res.header('Content-Type','application/json');
                    res.json({'sucess':false,'status':'Failed To Delete Post !','err':err});
                    
                }
                else{
                res.statusCode=200;
                res.header('Content-Type','application/json');
                res.json({'sucess':true,'details':'SucessFully Deleted Post !','err':null});
                }
            });
    });

    blogRoute.put('/updateBlog',passport.authenticate('jwt', { session: false }),(req,res)=>{

       UserBlog.Blog.findByIdAndUpdate(req.user._id,req.body,(err,result)=>{

            if(err){
                res.statusCode=500;
                res.header('Content-Type','application/json');
                res.json({'sucess':false,'status':'Failed To Update Post !','err':err});
            }
            else{
                res.statusCode=200;
                res.header('Content-Type','application/json');
                res.json({'sucess':true,'details':'SucessFully Update Post !','err':null});
            }
        });
});

    

    blogRoute.post('/postComment',passport.authenticate('jwt',{session:false}),(req,res)=>{

        const comment =new UserBlog.Comment({
            post_id:req.body.post_id,
            post_user:req.user._id,
            comment:req.body.comment
        });
        comment.save((err,result)=>{
            if(err){
                res.statusCode=500;
                res.header('Content-Type','application/json');
                res.json({'sucess':false,'details':null,'err':err});
            }
            else{
                res.statusCode=200;
                res.header('Content-Type','application/json');
                res.json({'sucess':true,'details':result,'err':false});
                UserBlog.Blog.findOneAndUpdate({_id:req.body.post_id},{$set:{
                    'post_comments':result._id
                }});
            }
        })

    });

    blogRoute.get('/getComment',passport.authenticate('jwt',{session:false}),(req,res)=>{

      UserBlog.Comment.find({},(err,result)=>{
            if(err){
                res.statusCode=500;
                res.header('Content-Type','application/json');
                res.json({'sucess':false,'status':'Failed to Fetch!','err':err});
            }
            else{
                res.statusCode=200;
                res.header('Content-Type','application/json');
                res.json({'sucess':true,'status':'SucessFully Got','err':false,'detail':result});
            }
        })
    });

    blogRoute.delete('/deleteComment',passport.authenticate('jwt',{session:false}),(req,res)=>{

     UserBlog.Comment.findByIdAndRemove(req.body._id,(err,result)=>{
            if(err){
                res.statusCode=500;
                res.header('Content-Type','application/json');
                res.json({'sucess':false,'status':'Delete failed !','err':err});
            }
            else{
                res.statusCode=200;
                res.header('Content-Type','application/json');
                res.json({'sucess':true,'status':'Deleted SucessFully','err':false});
            }
        });
    });

    module.exports=blogRoute;