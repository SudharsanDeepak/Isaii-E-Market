const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const memoryStore = require('../services/memoryStore');
const { isDbConnected } = require('../middleware/auth');

const getCart = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      let cart = await Cart.findOne({ user: req.user._id }).populate({
        path: 'items.product',
        select: 'name price image stock category discount brand seller'
      });

      if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
      }

      const validItems = cart.items.filter(item => item.product !== null);
      if (validItems.length !== cart.items.length) {
        cart.items = validItems;
        await cart.save();
      }

      return res.status(200).json({ success: true, cart });
    } else {
      let cart = memoryStore.carts.find(c => String(c.user) === String(req.user._id));
      if (!cart) {
        cart = { _id: new mongoose.Types.ObjectId().toString(), user: req.user._id, items: [] };
        memoryStore.carts.push(cart);
      }

      const populatedItems = cart.items
        .map(item => {
          const product = memoryStore.products.find(p => String(p._id) === String(item.product?._id || item.product));
          if (!product) return null;
          return {
            _id: item._id,
            quantity: item.quantity,
            product
          };
        })
        .filter(Boolean);

      return res.status(200).json({
        success: true,
        cart: {
          _id: cart._id,
          user: cart.user,
          items: populatedItems
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Please provide a product ID' });
    }

    if (isDbConnected()) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items in stock`
        });
      }

      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
      }

      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        const newQty = cart.items[existingItemIndex].quantity + Number(quantity);
        if (newQty > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Cannot exceed available stock (${product.stock})`
          });
        }
        cart.items[existingItemIndex].quantity = newQty;
      } else {
        cart.items.push({
          product: productId,
          quantity: Number(quantity)
        });
      }

      await cart.save();

      const populatedCart = await Cart.findById(cart._id).populate({
        path: 'items.product',
        select: 'name price image stock category discount brand seller'
      });

      return res.status(200).json({ success: true, cart: populatedCart });
    } else {
      const product = memoryStore.products.find(p => String(p._id) === String(productId));
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items in stock`
        });
      }

      let cart = memoryStore.carts.find(c => String(c.user) === String(req.user._id));
      if (!cart) {
        cart = { _id: new mongoose.Types.ObjectId().toString(), user: req.user._id, items: [] };
        memoryStore.carts.push(cart);
      }

      const existingItemIndex = cart.items.findIndex(
        (item) => String(item.product?._id || item.product) === String(productId)
      );

      if (existingItemIndex > -1) {
        const newQty = cart.items[existingItemIndex].quantity + Number(quantity);
        if (newQty > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Cannot exceed available stock (${product.stock})`
          });
        }
        cart.items[existingItemIndex].quantity = newQty;
      } else {
        cart.items.push({
          _id: new mongoose.Types.ObjectId().toString(),
          product: productId,
          quantity: Number(quantity)
        });
      }

      const populatedItems = cart.items
        .map(item => {
          const p = memoryStore.products.find(prod => String(prod._id) === String(item.product?._id || item.product));
          if (!p) return null;
          return {
            _id: item._id,
            quantity: item.quantity,
            product: p
          };
        })
        .filter(Boolean);

      return res.status(200).json({
        success: true,
        cart: {
          _id: cart._id,
          user: cart.user,
          items: populatedItems
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity === undefined || Number(quantity) < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    if (isDbConnected()) {
      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      const item = cart.items.id(itemId);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Cart item not found' });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      if (product.stock < Number(quantity)) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }

      item.quantity = Number(quantity);
      await cart.save();

      const populatedCart = await Cart.findById(cart._id).populate({
        path: 'items.product',
        select: 'name price image stock category discount brand seller'
      });

      return res.status(200).json({ success: true, cart: populatedCart });
    } else {
      let cart = memoryStore.carts.find(c => String(c.user) === String(req.user._id));
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      const item = cart.items.find(i => String(i._id) === String(itemId));
      if (!item) {
        return res.status(404).json({ success: false, message: 'Cart item not found' });
      }

      const product = memoryStore.products.find(p => String(p._id) === String(item.product?._id || item.product));
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      if (product.stock < Number(quantity)) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }

      item.quantity = Number(quantity);

      const populatedItems = cart.items
        .map(i => {
          const p = memoryStore.products.find(prod => String(prod._id) === String(i.product?._id || i.product));
          if (!p) return null;
          return {
            _id: i._id,
            quantity: i.quantity,
            product: p
          };
        })
        .filter(Boolean);

      return res.status(200).json({
        success: true,
        cart: {
          _id: cart._id,
          user: cart.user,
          items: populatedItems
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (isDbConnected()) {
      let cart = await Cart.findOne({ user: req.user._id });
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
      await cart.save();

      const populatedCart = await Cart.findById(cart._id).populate({
        path: 'items.product',
        select: 'name price image stock category discount brand seller'
      });

      return res.status(200).json({ success: true, cart: populatedCart });
    } else {
      let cart = memoryStore.carts.find(c => String(c.user) === String(req.user._id));
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      cart.items = cart.items.filter(i => String(i._id) !== String(itemId));

      const populatedItems = cart.items
        .map(i => {
          const p = memoryStore.products.find(prod => String(prod._id) === String(i.product?._id || i.product));
          if (!p) return null;
          return {
            _id: i._id,
            quantity: i.quantity,
            product: p
          };
        })
        .filter(Boolean);

      return res.status(200).json({
        success: true,
        cart: {
          _id: cart._id,
          user: cart.user,
          items: populatedItems
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      let cart = await Cart.findOne({ user: req.user._id });
      if (cart) {
        cart.items = [];
        await cart.save();
      }
      return res.status(200).json({
        success: true,
        cart: { user: req.user._id, items: [] }
      });
    } else {
      let cart = memoryStore.carts.find(c => String(c.user) === String(req.user._id));
      if (cart) {
        cart.items = [];
      }
      return res.status(200).json({
        success: true,
        cart: { user: req.user._id, items: [] }
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
