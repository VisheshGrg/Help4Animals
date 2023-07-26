const {cloudinary} = require('../cloudinary');
const Rescue=require('../models/rescue');
const User=require('../models/users');
const Shelter=require('../models/shelters');
const Adoption=require('../models/adoptions');

module.exports.renderPost = (req,res)=>{
    res.render('./adoptions/post');
} 

module.exports.newPost = async(req,res)=>{
    const {species,age,name,details,gender} = req.body;
    const adoption = new Adoption({species,age,name,details,gender});
    const user= await User.findById(req.session.user);
    const shelter = await Shelter.findOne({email: user.email});
    adoption.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    adoption.rescueShelter = req.session.user;
    adoption.location=shelter.location;
    await adoption.save();
    req.flash('success', 'Successfully posted for adoption!');
    res.redirect('/adoptions/index');   
}

module.exports.index = async(req,res)=>{
    const adoptions = await Adoption.find({});
    const values=["all","all","all","0"];
    res.render('./adoptions/index', {adoptions,values});
}

module.exports.filterAdoptions = async(req,res)=>{
    let {species,gender,age,location} = req.body;
    const allAdoptions = await Adoption.find({});
    const filterArr = (e) =>{
        if(species!=null){
            let spc = species.toLowerCase();
            spc=spc.charAt(0).toUpperCase()+spc.slice(1);
            if(e.species!=spc){
                return false;
            }
        }
        if(gender && e.gender!=gender){
            return false;
        }
        if(age && e.age!=age){
            return false;
        }
        return true;
    } 
    const adoptions = allAdoptions.filter((e) => filterArr(e));
    if(!species){
        species="all";
    }
    if(!location){
        location="all";
    }
    if(!age){
        age="0";
    }
    const values=[species,gender,location,age];
    res.render('./adoptions/index', {adoptions,values}); 
}