const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

const Story = mongoose.model('story');

router.get('/', (req, res) => {
	Story.find({ status: 'public' })
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

// Add a story
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('stories/add');
});

router.post('/', ensureAuthenticated, (req, res) => {
	let story = {}
	if (req.body.allowComments) {
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
			res.redirect(`/stories/show/${story.id}`);
		})
		.catch(err => {
			console.log(err);
			req.flash('error_msg', 'Unable to save story. Please try again');
			res.redirect('/stories/add');
		})
});

// Edit story
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Story.findOne({ _id: req.params.id })
		.then(story => {
			res.render('stories/edit', {
				story: story
			});
		});
});

// Edit story with PUT request
router.put('/:id', ensureAuthenticated, (req, res) => {
	Story.findOne({ _id: req.params.id })
		.then(story => {

			if (req.body.allowComments) {
				story.allowComments = true;
			}
			story.title = req.body.title;
			story.body = req.body.body;
			story.status = req.body.status;

			story.save()
				.then(story => {
					req.flash('success_msg', 'Story edited successfully');
					res.redirect(`/stories/show/${story.id}`);
				})
				.catch(err => {
					req.flash('error_msg', 'Unable to save story');
					res.redirect('/dashboard');
				});
		});
});

// Delete a story
router.delete('/:id', (req, res) => {
	Story.deleteOne({ _id: req.params.id })
		.then(() => {
			req.flash('success_msg', 'Story successfully deleted');
			res.redirect('/dashboard');
		})
		.catch(() => {
			req.flash('error_msg', 'Unable to delete story');
			res.redirect('/dashboard')
		})
})

// Show single story
router.get('/show/:id', (req, res) => {
	Story.findOne({ _id: req.params.id })
		.populate('user')
		.populate('comments.commentUser')
		.then(story => {
			res.render('stories/show', {
				story: story
			});
		});
});

// Add Comment
router.post('/comment/:id', (req, res) => {
	Story.findOne({ _id: req.params.id })
		.then(story => {
			const newComment = {
				commentBody: req.body.commentBody,
				commentUser: req.user.id
			}

			story.comments.unshift(newComment);

			story.save()
				.then(story => {
					req.flash('success_msg', 'Comment added');
					res.redirect(`/stories/show/${story.id}`);
				})
				.catch(err => {
					console.log(err);
					req.flash('error_msg', 'Unable to add comment');
					res.redirect(`/stories/show/${story.id}`);
				});
		});
});

module.exports = router;