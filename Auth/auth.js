const passport=require('passport');
const jwt=require('jsonwebtoken');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../Model/User');
const JwtStrategy=require('passport-jwt').Strategy;
const ExtractStrategy=require('passport-jwt').ExtractJwt;


module.exports=passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var opts={};
opts.jwtFromRequest=ExtractStrategy.fromAuthHeaderAsBearerToken();
opts.secretOrKey="1212-1212-1212-1212";

    module.exports=passport.use(new JwtStrategy(opts,function(jwt_payload,done){

        User.findOne({id:jwt_payload.id},function(err,user){

            if(err){
                    return done(null,err);
            }
            if(user){
                    return done(null,user);
            }
            else{
                    return done(null,false);
            }
        });

    }));

    module.exports.verify=passport.authenticate('jwt',{session:false});
