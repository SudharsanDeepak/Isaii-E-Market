import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  ChevronRight,
  Store
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isSeller } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading product details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <p className="text-xs text-slate-400">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  const handleAddToCart = async () => {
    if (isOutOfStock || isSeller) return;
    try {
      setActionLoading(true);
      setErrorMsg('');
      await addToCart(product._id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Error adding to cart');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock || isSeller) return;
    try {
      setActionLoading(true);
      await addToCart(product._id, quantity);
      navigate('/checkout');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Error processing purchase');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products" className="hover:text-white transition-colors">Products</Link>
        <ChevronRight size={14} />
        <Link to={`/products?category=${product.category}`} className="hover:text-white transition-colors">
          {product.category}
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-200 font-semibold truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[#0d0d12] border border-white/10 shadow-2xl">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 text-xs font-extrabold px-3 py-1 rounded-xl bg-gradient-to-r from-[#E83E8C] to-[#8B5CF6] text-white shadow-lg">
                -{product.discount}% OFF
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B5CF6]">
                {product.brand || 'Isaii'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-medium">{product.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#181820] border border-white/10 text-amber-300 text-xs font-bold">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>{product.rating || 4.5}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {product.numReviews || 120} Verified Ratings
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121217] border border-white/10 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">₹{discountedPrice.toLocaleString()}</span>
              {product.discount > 0 && (
                <span className="text-sm text-slate-500 line-through">₹{product.price.toLocaleString()}</span>
              )}
              {product.discount > 0 && (
                <span className="text-xs font-bold text-[#E83E8C]">
                  Save ₹{(product.price - discountedPrice).toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">Inclusive of applicable taxes</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Product Overview</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal bg-[#0d0d12] p-4 rounded-xl border border-white/5">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#121217] border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-950/60 text-[#B8C4FF]">
                <Store size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Sold by {product.seller?.name || 'Verified Isaii Merchant'}
                </p>
                <p className="text-[10px] text-slate-400">Direct Manufacturer Warranty Included</p>
              </div>
            </div>
            <div>
              {isOutOfStock ? (
                <Badge variant="danger">Out of Stock</Badge>
              ) : (
                <Badge variant="success">{product.stock} In Stock</Badge>
              )}
            </div>
          </div>

          {!isOutOfStock && !isSeller && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center bg-[#121217] border border-white/10 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40 font-medium">
                  {errorMsg}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={actionLoading}
                  className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                    added
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-white/5 hover:bg-white/10 border-white/15 text-white hover:border-purple-500/50'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={16} />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#E83E8C] hover:opacity-95 shadow-lg shadow-purple-950/50 hover:scale-[1.01] transition-all"
                >
                  <Zap size={16} />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          )}

          {isSeller && (
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200">
              You are signed in as a Merchant. Switch to a consumer account to buy products.
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-center">
            <div className="p-3 rounded-xl bg-[#121217] border border-white/5 space-y-1">
              <Truck size={18} className="mx-auto text-purple-400" />
              <p className="text-[11px] font-bold text-white">Free Express</p>
              <p className="text-[10px] text-slate-500">Orders &gt; ₹1,000</p>
            </div>
            <div className="p-3 rounded-xl bg-[#121217] border border-white/5 space-y-1">
              <ShieldCheck size={18} className="mx-auto text-pink-400" />
              <p className="text-[11px] font-bold text-white">Guaranteed</p>
              <p className="text-[10px] text-slate-500">100% Genuine</p>
            </div>
            <div className="p-3 rounded-xl bg-[#121217] border border-white/5 space-y-1">
              <RotateCcw size={18} className="mx-auto text-teal-400" />
              <p className="text-[11px] font-bold text-white">Easy Returns</p>
              <p className="text-[10px] text-slate-500">7-Day Replacement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
