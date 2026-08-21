import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Award,
  Search,
  Laptop,
  Shirt,
  Home as HomeIcon,
  Watch,
  Smile,
  Dumbbell
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const categories = [
  { name: 'Electronics', icon: Laptop, color: 'from-blue-500/20 to-purple-500/20', border: 'hover:border-purple-500/50' },
  { name: 'Fashion', icon: Shirt, color: 'from-pink-500/20 to-rose-500/20', border: 'hover:border-pink-500/50' },
  { name: 'Home', icon: HomeIcon, color: 'from-amber-500/20 to-orange-500/20', border: 'hover:border-amber-500/50' },
  { name: 'Accessories', icon: Watch, color: 'from-teal-500/20 to-emerald-500/20', border: 'hover:border-teal-500/50' },
  { name: 'Beauty', icon: Smile, color: 'from-fuchsia-500/20 to-pink-500/20', border: 'hover:border-fuchsia-500/50' },
  { name: 'Sports', icon: Dumbbell, color: 'from-cyan-500/20 to-blue-500/20', border: 'hover:border-cyan-500/50' }
];

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure Shopping',
    desc: 'JWT-backed token security, verified checkout processing, and customer protection guarantees.',
    color: 'text-purple-400',
    bg: 'bg-purple-950/40 border-purple-800/40'
  },
  {
    icon: Award,
    title: 'Verified Sellers',
    desc: 'All merchants undergo strict catalog audits to ensure premium quality and authentic goods.',
    color: 'text-pink-400',
    bg: 'bg-pink-950/40 border-pink-800/40'
  },
  {
    icon: Zap,
    title: 'Fast Order Processing',
    desc: 'Streamlined real-time inventory updates and dynamic order status synchronization.',
    color: 'text-teal-400',
    bg: 'bg-teal-950/40 border-teal-800/40'
  },
  {
    icon: Sparkles,
    title: 'Smart Product Discovery',
    desc: 'Filter, sort, and find the exact gear and lifestyle products you love in seconds.',
    color: 'text-amber-400',
    bg: 'bg-amber-950/40 border-amber-800/40'
  }
];

const LandingPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products/featured');
        if (res.data.success) {
          setFeaturedProducts(res.data.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      <section className="relative overflow-hidden pt-12 lg:pt-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 blur-[130px] rounded-full pointer-events-none -z-0" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-pink-600/10 blur-[110px] rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/50 text-[#B8C4FF] text-xs font-semibold shadow-inner">
                <Sparkles size={14} className="text-[#E83E8C]" />
                <span>Next-Generation E-Commerce Architecture</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Discover.{' '}
                <span className="gradient-text-purple-pink">Shop.</span>{' '}
                <span className="gradient-text-teal">Experience.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Isaii E-Commerce connects customers with quality products through a simple, elegant digital shopping experience. Built for scale, security, and verified merchants.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#E83E8C] hover:opacity-95 shadow-lg shadow-purple-900/40 hover:scale-[1.02] transition-all"
                >
                  <span>Explore Products</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-200 bg-[#16161f] hover:bg-[#1f1f2c] border border-white/10 hover:border-purple-500/40 transition-all"
                >
                  Become a Seller
                </Link>
              </div>

              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-2xl font-extrabold text-white">100%</p>
                  <p className="text-xs text-slate-400">Authentic Goods</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">₹0</p>
                  <p className="text-xs text-slate-400">Free Shipping &gt; ₹1k</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white">4.8★</p>
                  <p className="text-xs text-slate-400">Average Rating</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="p-2 rounded-3xl bg-gradient-to-tr from-[#8B5CF6]/30 via-white/10 to-[#E83E8C]/30 border border-white/10 shadow-2xl backdrop-blur-xl">
                  <div className="rounded-2xl overflow-hidden bg-[#0d0d12] border border-white/10 relative">
                    <img
                      src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                      alt="Featured Showcase"
                      className="w-full h-80 object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#14141c]/90 border border-white/10 backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-[#B8C4FF] border border-purple-800/40 uppercase">
                            Featured Acoustic
                          </span>
                          <h3 className="text-sm font-bold text-white mt-1">Quantum ANC Pro Wireless</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-white">₹7,499</p>
                          <p className="text-[10px] text-emerald-400 font-semibold">In Stock</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -left-6 p-4 rounded-2xl bg-[#161622]/90 border border-white/10 backdrop-blur-md shadow-xl hidden sm:flex items-center gap-3 animate-bounce duration-1000">
                  <div className="p-2.5 rounded-xl bg-purple-950 text-[#B8C4FF]">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Verified Merchant</p>
                    <p className="text-[10px] text-slate-400">Isaii Quality Assured</p>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 p-4 rounded-2xl bg-[#161622]/90 border border-white/10 backdrop-blur-md shadow-xl hidden sm:flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-pink-950 text-[#E83E8C]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Fast Dispatch</p>
                    <p className="text-[10px] text-slate-400">Dispatched in 24 Hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B5CF6]">Catalog</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Featured Categories</h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8C4FF] hover:text-white transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className={`p-5 rounded-2xl bg-[#121217] border border-white/10 ${cat.border} transition-all duration-300 hover:-translate-y-1 group flex flex-col items-center text-center`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-slate-200 group-hover:text-white group-hover:scale-110 transition-all border border-white/5 mb-3`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-[#B8C4FF] transition-colors">
                  {cat.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E83E8C]">Curated</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Featured Products</h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8C4FF] hover:text-white transition-colors"
          >
            <span>Explore Entire Store</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching products..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">Experience</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Why Isaii E-Commerce?</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Built with modern architecture to deliver superior consumer trust and frictionless seller commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-6 rounded-2xl bg-[#121217] border border-white/10 hover:border-purple-500/30 transition-all hover:-translate-y-1 space-y-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feat.bg} ${feat.color}`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-base font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-gradient-to-r from-[#14141e] via-[#1a142c] to-[#251224] border border-white/10 shadow-2xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-950/80 text-[#B8C4FF] border border-purple-800/50 uppercase tracking-wider">
              Grow with Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Start selling your products on Isaii Market today.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join verified merchants, access real-time inventory management, sales tracking, and seamless order fulfillment.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] hover:opacity-95 shadow-lg shadow-purple-950/50 transition-all hover:scale-[1.02]"
              >
                <span>Register as Merchant</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
