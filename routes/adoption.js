const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage});
const {isLoggedIn,isUserNotShelter, isLoggedInAsShelter,validateAdoption} = require('../middleware.js');
const Adoption=require('../models/adoptions');
const adoptions=require('../controllers/adoption');

router.route('/post')
    .get(isLoggedIn, isLoggedInAsShelter, catchAsync(adoptions.renderPost))
    .post(isLoggedIn,isLoggedInAsShelter, upload.array('images'), validateAdoption, catchAsync(adoptions.newPost));

router.route('/index')
    .get(isLoggedIn, catchAsync(adoptions.index));

router.post('/filter', isLoggedIn, catchAsync(adoptions.filterAdoptions));

router.get('/:id/edit', isLoggedIn,isLoggedInAsShelter, catchAsync(adoptions.editDetails));

router.route('/:id')
    .get(isLoggedIn, catchAsync(adoptions.viewDetails))
    .put(isLoggedIn, isLoggedInAsShelter, upload.array('images'), catchAsync(adoptions.updateDetails))
    .delete(isLoggedIn,isLoggedInAsShelter, catchAsync(adoptions.deleteAdoption));

module.exports = router;