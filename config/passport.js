const GoogleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const keys = require('./keys');

const User = mongoose.model('user');

module.exports = function(passport) {
	passport.use(
		new GoogleStrategy({
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback',
			proxy: true
		}, (accessToken, refreshToken, profile, done) => {

			// console.log(accessToken);
			// console.log(profile);
			
			const image = profile.photos[0].value;
			const email = profile.emails[0].value;
			const id = profile.id;
			const firstname = profile.name.givenName;
			const lastname = profile.name.familyName;

			const newUser = {
				googleID: id,
				email: email,
				firstName: firstname,
				lastName: lastname,
				image: image
			};

			// Check for existing user
			User.findOne({
				googleID: id
			}).then((user) => {
				if(user) {
					// Return existing user
					done(null, user);
				} else {
					// Create a user
					new User(newUser)
						.save()
						.then(user => {
							done(null, user);
						})
						.catch((err) => {
							done(err);
						});
				}
			});
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id).then((user) => {
			done(null, user);
		});
	});
};