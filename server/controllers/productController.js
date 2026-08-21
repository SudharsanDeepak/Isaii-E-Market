const mongoose = require('mongoose');
const Product = require('../models/Product');
const memoryStore = require('../services/memoryStore');
const { isDbConnected } = require('../middleware/auth');

const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, rating, search, sort, page = 1, limit = 12 } = req.query;

    if (isDbConnected()) {
      const query = {};

      if (category && category !== 'All') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (rating) {
        query.rating = { $gte: Number(rating) };
      }

      if (search && search.trim() !== '') {
        query.$or = [
          { name: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } },
          { category: { $regex: search.trim(), $options: 'i' } },
          { brand: { $regex: search.trim(), $options: 'i' } }
        ];
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'price-low') {
        sortOption = { price: 1 };
      } else if (sort === 'price-high') {
        sortOption = { price: -1 };
      } else if (sort === 'rating') {
        sortOption = { rating: -1 };
      } else if (sort === 'newest') {
        sortOption = { createdAt: -1 };
      }

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      const total = await Product.countDocuments(query);
      const products = await Product.find(query)
        .populate('seller', 'name email')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum);

      return res.status(200).json({
        success: true,
        count: products.length,
        total,
        pages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        products
      });
    } else {
      let filtered = [...memoryStore.products];

      if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (minPrice) {
        filtered = filtered.filter(p => p.price >= Number(minPrice));
      }

      if (maxPrice) {
        filtered = filtered.filter(p => p.price <= Number(maxPrice));
      }

      if (rating) {
        filtered = filtered.filter(p => (p.rating || 4.5) >= Number(rating));
      }

      if (search && search.trim() !== '') {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
        );
      }

      if (sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        filtered.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
      } else {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;
      const paginated = filtered.slice(skip, skip + limitNum);

      return res.status(200).json({
        success: true,
        count: paginated.length,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limitNum),
        currentPage: pageNum,
        products: paginated
      });
    }
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const product = await Product.findById(req.params.id).populate('seller', 'name email');
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.status(200).json({ success: true, product });
    } else {
      const product = memoryStore.products.find(p => String(p._id) === String(req.params.id));
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.status(200).json({ success: true, product });
    }
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const categories = await Product.distinct('category');
      return res.status(200).json({ success: true, categories });
    } else {
      const categories = Array.from(new Set(memoryStore.products.map(p => p.category)));
      return res.status(200).json({ success: true, categories });
    }
  } catch (error) {
    next(error);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const products = await Product.find({})
        .populate('seller', 'name email')
        .sort({ rating: -1, createdAt: -1 })
        .limit(8);
      return res.status(200).json({ success: true, products });
    } else {
      const products = [...memoryStore.products]
        .sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5))
        .slice(0, 8);
      return res.status(200).json({ success: true, products });
    }
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, image, stock, discount, brand } = req.body;

    if (!name || !description || price === undefined || !category || !image) {
      return res.status(400).json({ success: false, message: 'Please fill in all required product fields' });
    }

    if (isDbConnected()) {
      const product = await Product.create({
        name,
        description,
        price: Number(price),
        category,
        image,
        stock: Number(stock) || 0,
        discount: Number(discount) || 0,
        brand: brand || 'Isaii',
        seller: req.user._id
      });
      return res.status(201).json({ success: true, product });
    } else {
      const newProduct = {
        _id: new mongoose.Types.ObjectId().toString(),
        name,
        description,
        price: Number(price),
        category,
        image,
        stock: Number(stock) || 0,
        discount: Number(discount) || 0,
        brand: brand || 'Isaii',
        seller: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email
        },
        rating: 4.8,
        numReviews: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryStore.products.unshift(newProduct);
      return res.status(201).json({ success: true, product: newProduct });
    }
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      let product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      if (product.seller.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this product' });
      }

      const { name, description, price, category, image, stock, discount, brand } = req.body;

      if (name !== undefined) product.name = name;
      if (description !== undefined) product.description = description;
      if (price !== undefined) product.price = Number(price);
      if (category !== undefined) product.category = category;
      if (image !== undefined) product.image = image;
      if (stock !== undefined) product.stock = Number(stock);
      if (discount !== undefined) product.discount = Number(discount);
      if (brand !== undefined) product.brand = brand;

      await product.save();
      return res.status(200).json({ success: true, product });
    } else {
      const product = memoryStore.products.find(p => String(p._id) === String(req.params.id));
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const sellerId = product.seller?._id || product.seller;
      if (String(sellerId) !== String(req.user._id)) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this product' });
      }

      const { name, description, price, category, image, stock, discount, brand } = req.body;
      if (name !== undefined) product.name = name;
      if (description !== undefined) product.description = description;
      if (price !== undefined) product.price = Number(price);
      if (category !== undefined) product.category = category;
      if (image !== undefined) product.image = image;
      if (stock !== undefined) product.stock = Number(stock);
      if (discount !== undefined) product.discount = Number(discount);
      if (brand !== undefined) product.brand = brand;
      product.updatedAt = new Date().toISOString();

      return res.status(200).json({ success: true, product });
    }
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      if (product.seller.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
      }

      await Product.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } else {
      const productIdx = memoryStore.products.findIndex(p => String(p._id) === String(req.params.id));
      if (productIdx === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const product = memoryStore.products[productIdx];
      const sellerId = product.seller?._id || product.seller;
      if (String(sellerId) !== String(req.user._id)) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
      }

      memoryStore.products.splice(productIdx, 1);
      return res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
