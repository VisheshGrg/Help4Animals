const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const users=require('../controllers/user');
const User=require('../models/users');
const session=require('express-session');

router.route('/userRegister')
    .get(users.renderRegister)
    .post(catchAsync(users.createUser));

router.route('/login')
    .get(users.renderLogin)
    .post(users.loginUser);

router.get('/logout', users.logoutUser);

router.get('/profile/:id', users.userProfile);

module.exports = router;