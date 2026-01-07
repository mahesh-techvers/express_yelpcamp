const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../Utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const usersController = require('../controllers/users');


router.route('/register')
    .get((req, res) => { res.render('users/register') })
    .post(catchAsync(usersController.register));

router.route('/login')
    .get(usersController.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usersController.login);

router.get('/logout', usersController.logout);

module.exports = router;
