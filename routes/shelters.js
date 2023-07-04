const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const shelters=require('../controllers/shelter');
const Shelter=require('../models/shelters');
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage});
const {isLoggedIn} = require('../middleware.js');

router.get('/',catchAsync(shelters.index));

router.route('/register')
    .get(isLoggedIn, shelters.renderRegister)
    .post(upload.array('images'), catchAsync(shelters.createShelter));

router.route('/:id')
    .get(catchAsync(shelters.showShelter))

module.exports = router;