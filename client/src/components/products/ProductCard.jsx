import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isSeller } = useAuth();
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isOutOfStock = product.stock <= 0;
  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isSeller) return;

    try {
      setAdding(true);
      setErrorMsg('');
      await addToCart(product._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Error adding to cart');
      setTimeout(() => setErrorMsg(''), 3000);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative bg-[#121217] hover:bg-[#16161f] border border-white/10 hover:border-purple-500/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-purple-950/20 hover:-translate-y-1">
      <div>
        <div className="relative aspect-square w-full overflow-hidden bg-[#0d0d12]">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-transparent opacity-60" />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white border border-white/10">
              {product.category}
            </span>
            {product.discount > 0 && (
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-[#E83E8C] to-[#8B5CF6] text-white shadow-md">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-300 border border-white/10">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.5}</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{product.brand || 'Isaii'}</p>
          <Link to={`/products/${product._id}`}>
            <h3 className="text-sm font-semibold text-white group-hover:text-[#B8C4FF] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-white">₹{discountedPrice.toLocaleString()}</span>
            {product.discount > 0 && (
              <span className="text-xs text-slate-500 line-through">₹{product.price.toLocaleString()}</span>
            )}
          </div>

          <div>
            {isOutOfStock ? (
              <Badge variant="danger" size="sm">Out of Stock</Badge>
            ) : product.stock <= 5 ? (
              <Badge variant="warning" size="sm">Only {product.stock} left</Badge>
            ) : (
              <Badge variant="success" size="sm">In Stock</Badge>
            )}
          </div>
        </div>

        {errorMsg && (
          <p className="text-[11px] text-rose-400 bg-rose-950/40 p-1.5 rounded-lg border border-rose-800/40 text-center font-medium">
            {errorMsg}
          </p>
        )}

        <div className="grid grid-cols-5 gap-2 pt-1">
          <Link
            to={`/products/${product._id}`}
            className="col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 rounded-xl transition-colors"
          >
            <Eye size={14} />
            <span>Details</span>
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding || isSeller}
            className={`col-span-3 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
              isOutOfStock || isSeller
                ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                : added
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] hover:opacity-90 text-white shadow-md shadow-purple-950/40 hover:scale-[1.02]'
            }`}
          >
            {added ? (
              <>
                <Check size={14} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
