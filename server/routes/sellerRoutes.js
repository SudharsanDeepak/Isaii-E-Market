const express = require('express');
const router = express.Router();
const {
  getSellerDashboard,
  getSellerProducts,
  getSellerOrders,
  updateOrderStatus,
  getSellerAnalytics,
  seedSellerDemoProducts
} = require('../controllers/sellerController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('seller'));

router.get('/dashboard', getSellerDashboard);
router.get('/products', getSellerProducts);
router.post('/seed-demo', seedSellerDemoProducts);
router.get('/orders', getSellerOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/analytics', getSellerAnalytics);

module.exports = router;
