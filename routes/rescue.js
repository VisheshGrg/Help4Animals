const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage});
const rescues=require('../controllers/rescue');
const Rescue = require('../models/rescue');
const {isLoggedIn} = require('../middleware.js');

router.route('/post')
    .get(isLoggedIn,rescues.renderRescue)
    .post(isLoggedIn,upload.array('images'), catchAsync(rescues.addRescue));

router.get('/animals', rescues.showRescues);

module.exports = router;