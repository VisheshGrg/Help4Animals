const {shelterSchema} = require('./validateSchema.js');
const ExpressError=require('./utils/ExpressError.js');
const User=require('./models/users.js');
const Shelter=require('./models/shelters.js');
const Review=require('./models/reviews.js');
const Rescue=require('./models/rescue.js')

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

module.exports.isReview = async(req,res,next)=>{
    const {reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review){
        req.flash('error',"Review not found!");
        return res.redirect('/');
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!res.locals.currentUser===review.author._id){
        req.flash('error', 'You don\'t have permission to do that!');
        return res.redirect(`/shelter/${id}`);
    }
    next();
}

module.exports.isUserNotShelter = async(req,res,next)=>{
    const {id} = req.params;
    const user=await User.findById(res.locals.currentUser);
    const shelter=await Shelter.findOne({email: user.email});
    if(shelter){
        req.flash('error','You don\'t have permission to do that!');
        return res.redirect('/');
    }
    next();
}

module.exports.isLoggedInAsShelter = async(req,res,next)=>{
    const user=await User.findById(req.session.user);
    const shelter = await Shelter.findOne({email: user.email});
    if(!shelter){
        req.flash('error', 'You don\'t have permission to do that!');
        return res.redirect('/');
    }
    next();
}

module.exports.isRescueAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const rescue=await Rescue.findById(id);
    if(!res.locals.currentUser===rescue.caller._id){
        req.flash('error','You don\'t have permission to do that!');
        return req.redirect('/');
    }
    next();
}