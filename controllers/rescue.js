const {cloudinary} = require('../cloudinary');
const Rescue=require('../models/rescue');

module.exports.renderRescue = (req,res)=>{
    res.render('./animals/newPost');
}

module.exports.addRescue = async(req,res,next)=>{
    const {species,severe,description,locality,callerContact,identification} = req.body;
    const rescue=new Rescue({species:species,severe:severe,description:description,locality:locality,callerContact:callerContact,identification:identification});
    rescue.images=req.files.map(f => ({url: f.path, filename: f.filename}));
    rescue.caller=req.session.user;
    await rescue.save();
    req.flash('success',"Thankyou for posting about the injured animal! Rescue team will reach there as soon as possible.");
    res.redirect('/');
}

module.exports.showRescues = async(req,res) => {
    const rescues=await Rescue.find({});
    res.render('./animals/index', {rescues});
}