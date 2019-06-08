const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./config/keys');
const session = require('express-session');

// Load the Schemas
require('./models/User');

require('./config/passport')(passport);

mongoose.connect(keys.mongoURI, {
	useNewUrlParser: true
}).then(() => {
	console.log('MongoDB connected');
}).catch((err) => {
	console.log(err);
});

var app = express();

app.use(express.json());
app.use(express.static('assets'));
app.use(express.urlencoded({extended: true}));
if (app.get('env') === 'production') {
	app.set('trust proxy', 1) // trust first proxy
}
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Custom middleware
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	next();
})

// Loading routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

// Use routes
app.use('/', indexRouter);
app.use('/auth', authRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

app.on('error', (err) => {
	console.log("Error occurred: ");
	console.log(err);
});