const {cloudinary} = require('../cloudinary');
const Shelter = require('../models/shelters');
const User=require('../models/users');
const Rescue=require('../models/rescue');
const bcrypt=require('bcrypt');

module.exports.renderRegister = (req,res)=>{
    res.render('./shelters/register');
};

module.exports.createShelter = async(req,res,next)=>{
    const {sheltername,email,mobnumber,location,description,password,confPassword} = req.body;
    const findUser = await User.findOne({email: email});
    if(findUser){
        req.flash('error', 'Invalid email! (shelter must have its own email)');
        res.redirect('/shelters/register');
    }
    else if(password!=confPassword){
        req.flash('error','Password must be same!');
        res.redirect('/shelters/register');
    }
    else{
        bcrypt.hash(password,12, async(err,hash)=>{
            if(err) { return next(err);}
            const shelter=new Shelter({sheltername: sheltername,email:email,contact:mobnumber,location:location,description:description,password:hash});
            shelter.images = req.files.map(f => ({url: f.path, filename: f.filename}));
            shelter.owner=req.session.user;
            const user=new User({username:sheltername,email:email,password:hash});
            await shelter.save();
            await user.save();
            req.flash('success', 'Successfully made a new shelter!');
            res.redirect(`/shelters/${shelter._id}`);
        })
    }
};

module.exports.index = async(req,res)=>{
    const shelters=await Shelter.find({});
    res.render('./shelters/index', {shelters});
};

module.exports.showShelter = async(req,res,next) => {
    const {id}=req.params;
    const shelter=await Shelter.findById(id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('owner');
    if(!shelter){
        req.flash('error','Shelter not found!');
        res.redirect('/shelters');
    }
    const rescues=await Rescue.find({});
    const shelterRescues = rescues.filter((e) => e.rescueShelter==id);
    const countRescues = shelterRescues.length;
    const curUser=await User.findById(res.locals.currentUser);
    res.render('./shelters/show', {shelter,curUser,shelterRescues,countRescues});
};

module.exports.editShelter = async (req,res,next) => {
    const {id}=req.params;
    const shelter = await Shelter.findById(id);
    if(!shelter){
        req.flash('error','Shelter not found!');
        res.redirect('/');
    }
    res.render('shelters/edit',{shelter});
}

module.exports.updateCampground = async (req,res,next) => {
    const {id} = req.params;
    const shel = await Shelter.findById(id);
    const oldEmail=shel.email;
    const newEmail=req.body.shelter.email;
    const shelter = await Shelter.findByIdAndUpdate(id, {...req.body.shelter});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    shelter.images.push(...imgs);
    const user=await User.findOne({email: oldEmail});
    await shelter.save();
    user.email=newEmail;
    await user.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await shelter.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success',"Successfully updated!");
    res.redirect(`/shelters/${shelter._id}`);
}

module.exports.deleteShelter = async (req,res,next)=>{
    const {id} = req.params;
    const shelter=await Shelter.findById(id);
    const user=await User.findOne({email: shelter.email});
    await Shelter.findByIdAndDelete(id);
    await User.findByIdAndDelete(user._id);
    req.session.user=null;
    req.session.returnToPath=null;
    req.flash('success', "Successfuly deleted the shelter!");
    res.redirect('/');
};

module.exports.renderDonate = async (req,res,next)=>{
    res.send('Available soon!')
}