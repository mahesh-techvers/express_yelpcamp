const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../Utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const usersController = require('../controllers/users');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(usersController.register));

router.get('/login', usersController.renderLogin);

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usersController.login);

router.get('/logout', usersController.logout);

module.exports = router;
