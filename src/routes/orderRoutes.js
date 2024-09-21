const express = require('express');
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderPaymentStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Routes
router.route('/')
    .post(protect, createOrder)  // Protect this route for authenticated users
    .get(protect, admin, getAllOrders); // Admin can see all orders

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id/pay').put(protect, admin, updateOrderPaymentStatus);

module.exports = router;
