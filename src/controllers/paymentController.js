const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { generateInvoice } = require('../services/pdfService');
const nodemailer = require('nodemailer');

exports.processPayment = async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: { enabled: true },
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ message: 'Payment processing error', error });
    }
};

exports.processPayment = async (req, res) => {
    const { amount, currency, email, customerName } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: { enabled: true },
        });

        // Generate invoice PDF
        const invoicePath = `invoices/invoice_${paymentIntent.id}.pdf`;
        generateInvoice({ orderId: paymentIntent.id, customerName, amount }, invoicePath);

        // Send invoice via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Invoice',
            text: 'Thank you for your purchase. Please find your invoice attached.',
            attachments: [{ filename: 'invoice.pdf', path: invoicePath }],
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).json({ message: 'Email sending error', err });
            }
            res.status(200).json({ clientSecret: paymentIntent.client_secret, message: 'Payment successful, invoice sent!' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Payment processing error', error });
    }
};
