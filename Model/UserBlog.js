const mongoose=require('mongoose');
const Schema=mongoose.Schema;

    const CommentSchema=new Schema({

        post_user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        commment_date:{
            type:Date,
            default:Date.now
        },
        comment:{
            type:String,
        },
        post_id:{
                type:mongoose.Schema.Types.ObjectId,
                required:true
        }

    });

    const BlogSchema=new Schema({
        post_title:{
            type:String,
            required:true,
            min:5,
            max:75
        },
        post_image:{
            type:String
        },
        post_content:{
            type:String,
            required:true
        },
        post_type:{
            type:String,
            required:true
        },
        post_like_count:{
                    type:Number
        },
        post_contents:[CommentSchema],
        post_date:{
            type:Date,
            default:Date.now
        },
        post_user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    });

    const Comment=mongoose.model('Comments',CommentSchema);

    const Blog=mongoose.model('Blogs',BlogSchema);

   // module.exports=Comment;
    //module.exports=Blog;
    module.exports={
        Blog,
        Comment
    }