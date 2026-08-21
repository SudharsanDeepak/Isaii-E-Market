import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CartPage = () => {
  const { cart, subtotal, tax, shipping, grandTotal, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Updating cart..." />
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#14141c] border border-white/10 flex items-center justify-center text-[#8B5CF6]">
          <ShoppingBag size={36} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Your Cart is Empty</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Looks like you have not added anything to your cart yet. Explore our curated collections to find what you love.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] shadow-lg shadow-purple-950/50 hover:scale-[1.02] transition-all"
        >
          <span>Explore Products</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Shopping Cart</h1>
          <p className="text-xs text-slate-400 mt-1">Review your items and proceed to secure checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => {
            const product = item.product;
            if (!product) return null;
            const itemTotal = product.price * item.quantity;

            return (
              <div
                key={item._id}
                className="p-4 sm:p-5 rounded-2xl bg-[#121217] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-black/50 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6]">
                      {product.category}
                    </span>
                    <Link to={`/products/${product._id}`}>
                      <h3 className="text-sm font-bold text-white hover:text-[#B8C4FF] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-400">₹{product.price.toLocaleString()} each</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-white/5">
                  <div className="flex items-center bg-[#0d0d12] border border-white/10 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, Math.min(product.stock, item.quantity + 1))}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <p className="text-sm font-extrabold text-white">₹{itemTotal.toLocaleString()}</p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-4 sticky top-28">
          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 shadow-2xl space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-white/10 pb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-white">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (GST 18%)</span>
                <span className="font-semibold text-white">₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="font-semibold text-white">
                  {shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${shipping}`}
                </span>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
                <span className="font-bold text-white">Grand Total</span>
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#B8C4FF] via-[#8B5CF6] to-[#E83E8C]">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#E83E8C] hover:opacity-95 shadow-lg shadow-purple-950/50 transition-all hover:scale-[1.01]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Encrypted 256-bit Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
