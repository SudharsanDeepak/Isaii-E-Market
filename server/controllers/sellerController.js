const Product = require('../models/Product');
const Order = require('../models/Order');

const getSellerDashboard = async (req, res, next) => {
  try {
    const sellerId = req.user._id;

    const products = await Product.find({ seller: sellerId });
    const totalProducts = products.length;
    const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const outOfStockProducts = products.filter((p) => p.stock === 0).length;

    const orders = await Order.find({ 'items.seller': sellerId })
      .populate('consumer', 'name email')
      .populate('items.product', 'name price image category')
      .sort({ createdAt: -1 });

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;

    let totalSales = 0;
    orders.forEach((order) => {
      if (order.orderStatus !== 'Cancelled') {
        order.items.forEach((item) => {
          if (item.seller.toString() === sellerId.toString()) {
            totalSales += item.price * item.quantity;
          }
        });
      }
    });

    const recentOrders = orders.slice(0, 5);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalSales: Math.round(totalSales * 100) / 100,
        pendingOrders,
        lowStockProducts,
        outOfStockProducts
      },
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};

const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

const getSellerOrders = async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const orders = await Order.find({ 'items.seller': sellerId })
      .populate('consumer', 'name email phone')
      .populate('items.product', 'name price image category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const hasSellerItems = order.items.some(
      (item) => item.seller.toString() === req.user._id.toString()
    );

    if (!hasSellerItems) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    order.orderStatus = status;
    if (status === 'Delivered' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'Completed';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    next(error);
  }
};

const getSellerAnalytics = async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const products = await Product.find({ seller: sellerId });
    const orders = await Order.find({ 'items.seller': sellerId }).sort({ createdAt: -1 });

    let totalRevenue = 0;
    const productSalesMap = {};
    const categorySalesMap = {};

    orders.forEach((order) => {
      if (order.orderStatus !== 'Cancelled') {
        order.items.forEach((item) => {
          if (item.seller.toString() === sellerId.toString()) {
            const revenue = item.price * item.quantity;
            totalRevenue += revenue;

            const pId = item.product ? item.product.toString() : item.name;
            if (!productSalesMap[pId]) {
              productSalesMap[pId] = {
                name: item.name,
                image: item.image,
                quantity: 0,
                revenue: 0
              };
            }
            productSalesMap[pId].quantity += item.quantity;
            productSalesMap[pId].revenue += revenue;
          }
        });
      }
    });

    products.forEach((p) => {
      categorySalesMap[p.category] = (categorySalesMap[p.category] || 0) + 1;
    });

    const bestSellers = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const inventoryValue = products.reduce((acc, curr) => acc + curr.price * curr.stock, 0);

    res.status(200).json({
      success: true,
      analytics: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders: orders.length,
        inventoryValue: Math.round(inventoryValue * 100) / 100,
        totalProducts: products.length,
        bestSellers,
        categoryDistribution: categorySalesMap
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSellerDashboard,
  getSellerProducts,
  getSellerOrders,
  updateOrderStatus,
  getSellerAnalytics
};
