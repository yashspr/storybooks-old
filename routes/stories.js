const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

const Story = mongoose.model('story');

router.get('/', (req, res) => {
	Story.find({status: 'public'})
		.populate('user')
		.then(stories => {
			res.render('stories/index', {
				stories: stories
			});
		})
		.catch(err => {
			console.log(err);
			req.flash('error_msg', 'Something went wrong');
			res.redirect('/');
		})
});

router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('stories/add');
});

router.post('/add', ensureAuthenticated, (req, res) => {
	let story = {}
	if(req.body.allowComments) {
		story.allowComments = true;
	}
	story.title = req.body.title;
	story.body = req.body.body;
	story.status = req.body.status;
	story.user = req.user.id;

	new Story(story)
		.save()
		.then(story => {
			req.flash('success_msg', 'Story added successfully');
			res.redirect('/stories/');
			//res.redirect('/stories/view/${story.id}');
		})
		.catch(err => {
			console.log(err);
			req.flash('error_msg', 'Unable to save story. Please try again');
			res.redirect('/stories/add');
		})
});

module.exports = router;