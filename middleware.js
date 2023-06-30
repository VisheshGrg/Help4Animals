const {shelterSchema} = require('./validateSchema.js');
const ExpressError=require('./utils/ExpressError.js');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.session.user){
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}