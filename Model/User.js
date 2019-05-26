const mongoose=require('mongoose');
const PassportLocalMongoose=require('passport-local-mongoose');
const joi=require('joi');
const config=require('config');
const jwt=require('jsonwebtoken');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    firstname:{
        type:String,
    
    },
    imageUrl:{
            type:String,
            default:''
    },
    admin:{
        type:Boolean,
        default:false
    }
});
UserSchema.methods.generateToken=function(user){
    return jwt.sign(user._id,"1212-1212-1212-1212");
}
UserSchema.plugin(PassportLocalMongoose);

const User=mongoose.model('User',UserSchema);
module.exports=User;