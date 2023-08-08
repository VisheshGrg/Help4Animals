const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage});
const rescues=require('../controllers/rescue');
const Rescue = require('../models/rescue');
const {isLoggedIn,isUserNotShelter, isLoggedInAsShelter,validateRescue} = require('../middleware.js');
const rescue = require('../models/rescue');

router.route('/post')
    .get(isLoggedIn,isUserNotShelter,rescues.renderRescue)
    .post(isLoggedIn,isUserNotShelter,upload.array('images'), validateRescue, catchAsync(rescues.addRescue));

router.route('/animals')
    .get(catchAsync(rescues.showRescues))
    .post(catchAsync(rescues.filterRescues));

router.route('/:id/edit')
    .get(isLoggedIn,isUserNotShelter, catchAsync(rescues.editRescue))
    .put(isLoggedIn,isUserNotShelter,upload.array('images'),catchAsync(rescues.updateRescue));

router.get('/:id/details', isLoggedIn, isLoggedInAsShelter, catchAsync(rescues.rescueDetails));

router.get('/:id/confirmRescue', isLoggedIn, isLoggedInAsShelter, catchAsync(rescues.confirmRescue));

router.delete('/:id/delete', isLoggedIn,isUserNotShelter,catchAsync(rescues.deleteRescue));

module.exports = router;