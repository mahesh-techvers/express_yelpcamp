const express = require('express');
const router = express.Router();
const Joi = require('joi');
const catchAsync = require('../Utils/catchAsync');
const ExpressError = require('../Utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('../schemas');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgroundsController = require('../controllers/campgrounds');

router.get('/', catchAsync(campgroundsController.index));

router.get('/new', isLoggedIn, campgroundsController.renderNewForm);

router.post('/', isLoggedIn, validateCampground, catchAsync(campgroundsController.createCampground));

router.get('/:id', catchAsync(campgroundsController.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.editCampground));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundsController.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground));

module.exports = router;
