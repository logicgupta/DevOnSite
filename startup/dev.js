const helmet=require('helmet');
const compress=require('compress');

module.exports=function(app){
    app.use(helmet());

}