const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
		scope: ['profile', 'email']
	})
);

router.get('/google/callback', passport.authenticate('google', {
	failureRedirect: '/'
}), (req, res) => {
	res.redirect('/dashboard');
});

router.get('/verify', (req, res) => {
	if(req.user) {
		res.end("User logged in");
	} else {
		res.end('User not authenticated');
	}
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;