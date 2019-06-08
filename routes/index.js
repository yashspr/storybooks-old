const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.end('It works');
})

module.exports = router;