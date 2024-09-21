const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/users/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Find existing user by Google ID or create a new one
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: 'google-oauth', // Not used but required field
            });
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
