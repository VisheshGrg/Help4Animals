const {cloudinary} = require('../cloudinary');
const Rescue=require('../models/rescue');
const User=require('../models/users');
const Shelter=require('../models/shelters');

module.exports.renderRescue = (req,res)=>{
    res.render('./animals/newPost');
}

module.exports.addRescue = async(req,res,next)=>{
    const {species,severe,description,locality,callerContact,identification} = req.body;
    const rescue=new Rescue({species:species,severe:Number(severe),description:description,locality:locality,callerContact:callerContact,identification:identification});
    rescue.images=req.files.map(f => ({url: f.path, filename: f.filename}));
    rescue.caller=req.session.user;
    await rescue.save();
    req.flash('success',"Thankyou for posting about the injured animal! Rescue team will reach there as soon as possible.");
    res.redirect('/');
}

module.exports.showRescues = async(req,res) => {
    let rescues=await Rescue.find({});

    rescues = rescues.filter((obj) => {
        return obj.active==true;
    });
    rescues.sort(function(a,b) {return b.severe-a.severe});
    const location="";
    res.render('./animals/index', {rescues,location});
}

module.exports.filterRescues = async(req,res) => {
    const {location} = req.body;
    if(!location){
        res.redirect('/rescue/animals');
    }
    else{
        const filterArray = (e) => {
            let loc=e.locality.toLowerCase();
            if(loc.indexOf(location.toLowerCase())==-1){
                return false;
            }
            return true;
        }
    
        const allRescues = await Rescue.find({});
        let rescues = allRescues.filter((e) => filterArray(e));
        rescues = rescues.filter((e) => {
            return e.active==true;
        });
        rescues.sort(function(a,b) {return b.severe-a.severe});
        res.render('./animals/index', {rescues,location});
    }
}

module.exports.editRescue = async(req,res) => {
    const {id} = req.params;
    const rescue=await Rescue.findById(id);
    if(!rescue){
        req.flash('error','Rescue info not found!');
        res.redirect('/');
    }
    res.render('./animals/edit', {rescue});
}

module.exports.updateRescue = async(req,res) => {
    const {id} = req.params;
    const rescue = await Rescue.findByIdAndUpdate(id,{...req.body.rescue});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    rescue.images.push(...imgs);
    await rescue.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await rescue.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success','Successfully updated your submission!');
    res.redirect(`/profile/${req.session.user}`);
}

module.exports.rescueDetails = async(req,res) => {
    const {id} = req.params;
    const rescue = await Rescue.findById(id);
    res.render(`./animals/details`, {rescue});
}

module.exports.confirmRescue = async(req,res) => {
    const {id} = req.params;
    const rescue = await Rescue.findById(id);
    if(!rescue){
        req.flash('error', 'Sorry! This id doesn\'t exist!');
        res.redirect('/rescue/animals');
    }
    const user=await User.findById(req.session.user);
    const shelter=await Shelter.findOne({email: user.email});
    rescue.rescueShelter = shelter._id;
    rescue.active=false;
    await rescue.save();
    req.flash('success', 'Rescue confirmed!');
    res.redirect('/rescue/animals');
}

module.exports.deleteRescue = async(req,res) => {
    const {id} = req.params;
    await Rescue.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted your submission!');
    res.redirect(`/profile/${req.session.user}`);
}
