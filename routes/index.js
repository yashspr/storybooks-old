const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index/welcome', {
		title: 'Welcome to StoryBooks',
	});
});

router.get('/dashboard', (req, res) => {
	res.end('Dashboard');
})

module.exports = router;