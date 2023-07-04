const express=require('express');
const route = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware.js');
const reviews=require('../controllers/review');
const Shelter=require('../models/shelters');
const Review=require('../models/reviews');

route.post('/', isLoggedIn, catchAsync(reviews.createReview));

module.exports = route;