const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage});
const rescues=require('../controllers/rescue');
const Rescue = require('../models/rescue');
const {isLoggedIn,isUserNotShelter} = require('../middleware.js');
const rescue = require('../models/rescue');

router.route('/post')
    .get(isLoggedIn,rescues.renderRescue)
    .post(isLoggedIn,upload.array('images'), catchAsync(rescues.addRescue));

router.get('/animals', rescues.showRescues);

router.route('/:id/edit')
    .get(isLoggedIn,isUserNotShelter, catchAsync(rescues.editRescue))
    .put(isLoggedIn,isUserNotShelter,upload.array('images'),catchAsync(rescues.updateRescue));

router.get('/:id/details', isLoggedIn, catchAsync(rescues.rescueDetails));

router.delete('/:id/delete', isLoggedIn,isUserNotShelter,catchAsync(rescues.deleteRescue));

module.exports = router;