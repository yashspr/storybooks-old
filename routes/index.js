const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

const Story = mongoose.model('story');

router.get('/', ensureGuest, (req, res) => {
	res.render('index/welcome', {
		title: 'Welcome to StoryBooks',
	});
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
	Story.find({user: req.user.id})
		.then(stories => {
			res.render('index/dashboard', {
				stories
			});
		});
});

router.get('/about', (req, res) => {
	res.render('index/about');
});

module.exports = router;