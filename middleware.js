const {shelterSchema} = require('./validateSchema.js');
const ExpressError=require('./utils/ExpressError.js');
const User=require('./models/users.js');
const Shelter=require('./models/shelters.js');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.session.user){
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id}=req.params;
    const shelter=await Shelter.findById(id);
    const user=await User.findOne({email: shelter.email});
    if(!res.locals.currentUser===user._id){
        req.flash('error', 'You don\'t have permission to do that!');
        return res.redirect(`/shelters/${id}`);
    }
    next();
}

module.exports.isShelter = async (req,res,next)=>{
    const {id} = req.params;
    const shelter = await Shelter.findById(id);
    if(!shelter){
        req.flash('error',"Shelter not found!");
        return res.redirect('/shelters')
    }
    next();
}

