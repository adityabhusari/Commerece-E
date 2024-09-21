const axios = require('axios');

const recaptchaMiddleware = async (req, res, next) => {
    const recaptchaToken = req.body.recaptchaToken;

    if (!recaptchaToken) {
        return res.status(400).json({ message: 'No reCAPTCHA token provided' });
    }

    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, {}, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: recaptchaToken,
            },
        });

        const { success, score } = response.data;
        if (!success || score < 0.5) {
            return res.status(400).json({ message: 'reCAPTCHA verification failed' });
        }

        next(); // Proceed if reCAPTCHA is valid
    } catch (error) {
        return res.status(500).json({ message: 'reCAPTCHA validation error' });
    }
};

module.exports = recaptchaMiddleware;
