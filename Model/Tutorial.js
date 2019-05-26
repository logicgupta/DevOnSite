const mongoose=require('mongoose');
const Schema=mongoose.Schema;
    const tutorialSchema=new Schema({

        tutorial_admin:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        tutorial_type:{
            type:String,
            required:true
        },
        tutorial_content:{
            type:String,
            required:true
        },
        tutorial_image:{
            type:String
        },
        tutorial_Date:{
            type:Date,
            default:Date.now
        }
    });

    module.exports=mongoose.model('Tutorial',tutorialSchema);
