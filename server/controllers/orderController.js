const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Please provide full shipping details' });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.name || item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      product.stock -= item.quantity;
      await product.save();

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
        seller: product.seller
      });
    }

    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const shipping = subtotal > 1000 ? 0 : 50;
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;

    const paymentStatus = paymentMethod === 'ONLINE' ? 'Completed' : 'Pending';

    const order = await Order.create({
      consumer: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus,
      orderStatus: 'Pending'
    });

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ consumer: req.user._id })
      .populate('items.product', 'name image price category')
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

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('consumer', 'name email phone')
      .populate('items.product', 'name image price category')
      .populate('items.seller', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isConsumer = order.consumer._id.toString() === req.user._id.toString();
    const isSeller = order.items.some(
      (item) => item.seller && item.seller._id.toString() === req.user._id.toString()
    );

    if (!isConsumer && !isSeller) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};
