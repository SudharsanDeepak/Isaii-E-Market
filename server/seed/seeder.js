const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/isaii-ecommerce';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});

    const consumer = await User.create({
      name: 'Deepak Consumer',
      email: 'consumer@isaii.com',
      password: 'Password123!',
      role: 'consumer',
      phone: '+91 98765 43210',
      address: {
        street: '12 Tech Park Avenue',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001'
      }
    });

    const seller = await User.create({
      name: 'Isaii Tech Seller',
      email: 'seller@isaii.com',
      password: 'Password123!',
      role: 'seller',
      phone: '+91 91234 56789',
      address: {
        street: '88 Innovation Boulevard',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001'
      }
    });

    const products = [
      {
        name: 'Quantum ANC Pro Wireless Headphones',
        description: 'Engineered with hybrid active noise cancellation, custom 40mm graphene drivers, and 45 hours of battery life with rapid USB-C charging.',
        price: 7499,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        stock: 35,
        discount: 15,
        brand: 'Isaii Acoustics',
        seller: seller._id,
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
        seller: seller._id,
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
        seller: seller._id,
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
        seller: seller._id,
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
        seller: seller._id,
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
        seller: seller._id,
        rating: 4.8,
        numReviews: 64
      },
      {
        name: 'Halo Minimalist Ambient Smart Desk Lamp',
        description: 'Touchless gesture dimming, circadian auto-color temperature tuning (2700K-6500K), and integrated 15W Qi fast charging base.',
        price: 2499,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        stock: 15,
        discount: 15,
        brand: 'Isaii Living',
        seller: seller._id,
        rating: 4.5,
        numReviews: 43
      },
      {
        name: 'BoomSphere 360 Waterproof Bluetooth Speaker',
        description: 'Immersive 360-degree spatial acoustic drivers with punchy bass radiators, IPX7 waterproof rating, and 24-hour party playback.',
        price: 3299,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
        stock: 8,
        discount: 10,
        brand: 'Isaii Acoustics',
        seller: seller._id,
        rating: 4.7,
        numReviews: 110
      },
      {
        name: 'Botanica Deep Moisture Botanical Glow Serum',
        description: 'Cold-pressed organic botanical formulation with 5% Niacinamide, Hyaluronic acid complex, and vitamin E antioxidant shield.',
        price: 1299,
        category: 'Beauty',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        stock: 65,
        discount: 25,
        brand: 'Botanica Organics',
        seller: seller._id,
        rating: 4.8,
        numReviews: 140
      },
      {
        name: 'ProAlign Ergonomic Mesh Studio Executive Chair',
        description: 'Dynamic 3D lumbar support matrix, breathable high-tensile mesh backing, and multi-position tilt lock for 12+ hour comfort.',
        price: 12999,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1580481077197-2a6237198bb9?auto=format&fit=crop&w=800&q=80',
        stock: 6,
        discount: 18,
        brand: 'Isaii Studio',
        seller: seller._id,
        rating: 4.9,
        numReviews: 53
      },
      {
        name: 'GripPro High-Density Alignment Yoga Mat',
        description: 'Eco-friendly non-slip natural tree rubber surface with laser-etched alignment markings and 6mm joint cushion support.',
        price: 1599,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
        stock: 30,
        discount: 0,
        brand: 'Isaii Active',
        seller: seller._id,
        rating: 4.6,
        numReviews: 38
      },
      {
        name: 'MagStand 3-in-1 Fast Magnetic Charging Station',
        description: 'Simultaneously fast-charge iPhone, Apple Watch, and AirPods with certified 15W magnetic alignment and thermal control.',
        price: 2699,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?auto=format&fit=crop&w=800&q=80',
        stock: 45,
        discount: 10,
        brand: 'Isaii Gear',
        seller: seller._id,
        rating: 4.8,
        numReviews: 95
      }
    ];

    const createdProducts = await Product.insertMany(products);

    const demoOrder = await Order.create({
      consumer: consumer._id,
      items: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].image,
          price: createdProducts[0].price,
          quantity: 1,
          seller: seller._id
        },
        {
          product: createdProducts[2]._id,
          name: createdProducts[2].name,
          image: createdProducts[2].image,
          price: createdProducts[2].price,
          quantity: 1,
          seller: seller._id
        }
      ],
      shippingAddress: {
        fullName: 'Deepak Consumer',
        email: 'consumer@isaii.com',
        phone: '+91 98765 43210',
        address: '12 Tech Park Avenue',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001'
      },
      subtotal: 9398,
      tax: 1691.64,
      shipping: 0,
      total: 11089.64,
      paymentMethod: 'ONLINE',
      paymentStatus: 'Completed',
      orderStatus: 'Processing'
    });

    console.log('Sample Data Seeded Successfully:');
    console.log(`- Consumer: consumer@isaii.com / Password123!`);
    console.log(`- Seller: seller@isaii.com / Password123!`);
    console.log(`- Products: ${createdProducts.length} items`);
    console.log(`- Demo Order: ${demoOrder._id}`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
