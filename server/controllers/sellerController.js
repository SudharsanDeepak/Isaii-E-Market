const Product = require('../models/Product');
const Order = require('../models/Order');
const memoryStore = require('../services/memoryStore');
const { isDbConnected } = require('../middleware/auth');

const getSellerDashboard = async (req, res, next) => {
  try {
    const sellerId = req.user._id;

    if (isDbConnected()) {
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

      return res.status(200).json({
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
    } else {
      const products = memoryStore.products.filter(
        p => String(p.seller?._id || p.seller) === String(sellerId)
      );
      const totalProducts = products.length;
      const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
      const outOfStockProducts = products.filter((p) => p.stock === 0).length;

      const orders = memoryStore.orders.filter(o =>
        o.items.some(i => String(i.seller?._id || i.seller) === String(sellerId))
      );

      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;

      let totalSales = 0;
      orders.forEach((order) => {
        if (order.orderStatus !== 'Cancelled') {
          order.items.forEach((item) => {
            if (String(item.seller?._id || item.seller) === String(sellerId)) {
              totalSales += item.price * item.quantity;
            }
          });
        }
      });

      const recentOrders = orders.slice(0, 5);

      return res.status(200).json({
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
    }
  } catch (error) {
    next(error);
  }
};

const getSellerProducts = async (req, res, next) => {
  try {
    const sellerId = req.user._id;

    if (isDbConnected()) {
      const products = await Product.find({ seller: sellerId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: products.length, products });
    } else {
      const products = memoryStore.products
        .filter(p => String(p.seller?._id || p.seller) === String(sellerId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json({ success: true, count: products.length, products });
    }
  } catch (error) {
    next(error);
  }
};

const getSellerOrders = async (req, res, next) => {
  try {
    const sellerId = req.user._id;

    if (isDbConnected()) {
      const orders = await Order.find({ 'items.seller': sellerId })
        .populate('consumer', 'name email phone')
        .populate('items.product', 'name price image category')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, count: orders.length, orders });
    } else {
      const orders = memoryStore.orders
        .filter(o => o.items.some(i => String(i.seller?._id || i.seller) === String(sellerId)))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({ success: true, count: orders.length, orders });
    }
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

    if (isDbConnected()) {
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
      return res.status(200).json({ success: true, message: `Order status updated to ${status}`, order });
    } else {
      const order = memoryStore.orders.find(o => String(o._id) === String(req.params.id));
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      const hasSellerItems = order.items.some(
        (item) => String(item.seller?._id || item.seller) === String(req.user._id)
      );

      if (!hasSellerItems) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
      }

      order.orderStatus = status;
      if (status === 'Delivered' && order.paymentMethod === 'COD') {
        order.paymentStatus = 'Completed';
      }
      order.updatedAt = new Date().toISOString();

      return res.status(200).json({ success: true, message: `Order status updated to ${status}`, order });
    }
  } catch (error) {
    next(error);
  }
};

const getSellerAnalytics = async (req, res, next) => {
  try {
    const sellerId = req.user._id;

    if (isDbConnected()) {
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

      return res.status(200).json({
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
    } else {
      const products = memoryStore.products.filter(
        p => String(p.seller?._id || p.seller) === String(sellerId)
      );
      const orders = memoryStore.orders.filter(o =>
        o.items.some(i => String(i.seller?._id || i.seller) === String(sellerId))
      );

      let totalRevenue = 0;
      const productSalesMap = {};
      const categorySalesMap = {};

      orders.forEach((order) => {
        if (order.orderStatus !== 'Cancelled') {
          order.items.forEach((item) => {
            if (String(item.seller?._id || item.seller) === String(sellerId)) {
              const revenue = item.price * item.quantity;
              totalRevenue += revenue;

              const pId = item.product?._id || item.product || item.name;
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

      return res.status(200).json({
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
    }
  } catch (error) {
    next(error);
  }
};

const seedSellerDemoProducts = async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const sellerInfo = {
      _id: sellerId,
      name: req.user.name || 'Merchant',
      email: req.user.email || 'seller@isaii.com'
    };

    const sampleProducts = [
      {
        name: 'Quantum ANC Pro Wireless Headphones',
        description: 'Engineered with hybrid active noise cancellation, custom 40mm graphene drivers, and 45 hours of battery life with rapid USB-C charging.',
        price: 7499,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        stock: 35,
        discount: 15,
        brand: 'Isaii Acoustics',
        rating: 4.8,
        numReviews: 128
      },
      {
        name: 'Pulse X Pro Smartwatch Titanium Edition',
        description: 'Ultra-bright 1.95-inch AMOLED sapphire display, ECG and SpO2 health tracking, multi-sport GPS with 14-day standby.',
        price: 5999,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        stock: 22,
        discount: 10,
        brand: 'Isaii Gear',
        rating: 4.9,
        numReviews: 94
      },
      {
        name: 'ErgoLift Precision Aluminum Laptop Stand',
        description: 'Aircraft-grade anodized aluminum construction with 360-degree ventilation flow and dual-axis ergonomic height adjustment.',
        price: 1899,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
        stock: 50,
        discount: 5,
        brand: 'Isaii Studio',
        rating: 4.7,
        numReviews: 76
      },
      {
        name: 'Vortex RGB Hot-Swappable Mechanical Keyboard',
        description: 'Compact 75% mechanical keyboard with factory-lubed custom linear switches, PBT shine-through keycaps, and tri-mode wireless connectivity.',
        price: 4999,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        stock: 18,
        discount: 20,
        brand: 'Isaii Keyworks',
        rating: 4.9,
        numReviews: 152
      },
      {
        name: 'AeroGlide Ultra-Cushion Running Sneakers',
        description: 'Dynamic foam responsiveness with breathable woven knit mesh upper and anti-torsion carbon plate for all-day athletic performance.',
        price: 3499,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        stock: 28,
        discount: 12,
        brand: 'AeroWear',
        rating: 4.6,
        numReviews: 89
      },
      {
        name: 'Apex WeatherShield Urban Commuter Backpack 28L',
        description: 'Ballistic waterproof Cordura fabric with padded 16-inch laptop chamber, concealed anti-theft compartments, and magnetic Fidlock buckles.',
        price: 2799,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        stock: 40,
        discount: 0,
        brand: 'Isaii Carry',
        rating: 4.8,
        numReviews: 64
      },
      {
        name: 'Halo Minimalist Ambient Smart Desk Lamp',
        description: 'Touchless gesture dimming, circadian auto-color temperature tuning (2700K-6500K), and integrated 15W Qi fast charging base.',
        price: 2499,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        stock: 8,
        discount: 15,
        brand: 'Isaii Living',
        rating: 4.5,
        numReviews: 43
      },
      {
        name: 'BoomSphere 360 Waterproof Bluetooth Speaker',
        description: 'Immersive 360-degree spatial acoustic drivers with punchy bass radiators, IPX7 waterproof rating, and 24-hour party playback.',
        price: 3299,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
        stock: 0,
        discount: 10,
        brand: 'Isaii Acoustics',
        rating: 4.7,
        numReviews: 110
      }
    ];

    if (isDbConnected()) {
      const docs = sampleProducts.map((p) => ({
        ...p,
        seller: sellerId
      }));
      const created = await Product.insertMany(docs);
      return res.status(201).json({
        success: true,
        message: `Successfully seeded ${created.length} sample products for your store.`,
        products: created
      });
    } else {
      const created = sampleProducts.map((p, idx) => {
        const item = {
          _id: `prod_${Date.now()}_${idx}`,
          ...p,
          seller: sellerInfo,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        memoryStore.products.unshift(item);
        return item;
      });
      return res.status(201).json({
        success: true,
        message: `Successfully seeded ${created.length} sample products for your store.`,
        products: created
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSellerDashboard,
  getSellerProducts,
  getSellerOrders,
  updateOrderStatus,
  getSellerAnalytics,
  seedSellerDemoProducts
};
