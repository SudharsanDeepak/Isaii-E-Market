const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const memoryStore = require('../services/memoryStore');
const { isDbConnected } = require('../middleware/auth');

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Please provide full shipping details' });
    }

    if (isDbConnected()) {
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
      return res.status(201).json({ success: true, order });
    } else {
      const orderItems = [];
      let subtotal = 0;

      for (const item of items) {
        const product = memoryStore.products.find(p => String(p._id) === String(item.product?._id || item.product));
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
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product: product,
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

      const newOrder = {
        _id: new mongoose.Types.ObjectId().toString(),
        consumer: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone
        },
        items: orderItems,
        shippingAddress,
        subtotal,
        tax,
        shipping,
        total,
        paymentMethod: paymentMethod || 'COD',
        paymentStatus,
        orderStatus: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      memoryStore.orders.unshift(newOrder);

      const cart = memoryStore.carts.find(c => String(c.user) === String(req.user._id));
      if (cart) {
        cart.items = [];
      }

      return res.status(201).json({ success: true, order: newOrder });
    }
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const orders = await Order.find({ consumer: req.user._id })
        .populate('items.product', 'name image price category')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, count: orders.length, orders });
    } else {
      const orders = memoryStore.orders
        .filter(o => String(o.consumer?._id || o.consumer) === String(req.user._id))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({ success: true, count: orders.length, orders });
    }
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
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

      return res.status(200).json({ success: true, order });
    } else {
      const order = memoryStore.orders.find(o => String(o._id) === String(req.params.id));
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      const consumerId = order.consumer?._id || order.consumer;
      const isConsumer = String(consumerId) === String(req.user._id);
      const isSeller = order.items.some(
        (item) => String(item.seller?._id || item.seller) === String(req.user._id)
      );

      if (!isConsumer && !isSeller) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
      }

      return res.status(200).json({ success: true, order });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};
