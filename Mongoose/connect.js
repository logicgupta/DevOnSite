const mongoose=require('mongoose');
module.exports=function(){
    mongoose.connect("mongodb://localhost:27017/blog",(err)=>{ 
        if(err){
            console.log('Connection Failed !');
        }
        else{
            console.log('SucessFully Connected to Database');
        }
    });
}