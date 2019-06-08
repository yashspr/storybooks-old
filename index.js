const express = require('express');
const mongoose = require('mongoose');

var app = express();

// Loading routes
const indexRouter = require('./routes/index');


app.use('/', indexRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});