const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const shelters=require('../controllers/shelter');
const Shelter=require('../models/shelters');
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage});
const {isLoggedIn, isAuthor, isShelter} = require('../middleware.js');
    
router.get('/',catchAsync(shelters.index));

router.route('/register')
    .get(isLoggedIn, shelters.renderRegister)
    .post(upload.array('images'), catchAsync(shelters.createShelter));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(shelters.editShelter));

router.get('/:id/donate', isLoggedIn, isShelter, catchAsync(shelters.renderDonate));

router.route('/:id')
    .get(catchAsync(shelters.showShelter))
    .put(isLoggedIn,isAuthor,isShelter, upload.array('images'), catchAsync(shelters.updateCampground))
    .delete(isLoggedIn, isAuthor, isShelter, catchAsync(shelters.deleteShelter));

module.exports = router;