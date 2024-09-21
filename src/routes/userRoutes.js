const express = require('express');
const passport = require('passport');
const recaptchaMiddleware = require('../middlewares/recaptchaMiddleware');


const { signup, login, resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', recaptchaMiddleware, signup);
router.post('/login', recaptchaMiddleware, login);
router.post('/reset-password', resetPassword);

// Google OAuth routes
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home or respond with JWT
        const token = generateToken(req.user);
        res.status(200).json({ user: req.user, token });
    }
);

module.exports = router;
