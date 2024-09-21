const express = require('express');
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware'); // Protect routes with authentication middleware
const router = express.Router();

// Routes
router.route('/')
    .post(protect, createProduct) // Admin-only functionality
    .get(getAllProducts);

router.route('/:id')
    .get(getProductById)
    .put(protect, updateProduct) // Admin-only functionality
    .delete(protect, deleteProduct); // Admin-only functionality

module.exports = router;
