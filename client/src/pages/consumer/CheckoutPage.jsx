import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, CheckCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CheckoutPage = () => {
  const { cart, subtotal, tax, shipping, grandTotal, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cart.items || cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!shippingData.fullName || !shippingData.address || !shippingData.city || !shippingData.pincode) {
      setError('Please fill in all shipping details');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderPayload = {
        items: cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          name: item.product.name,
          price: item.product.price
        })),
        shippingAddress: shippingData,
        paymentMethod
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        await fetchCart();
        navigate(`/orders/${res.data.order._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Cart is empty</h2>
        <Link to="/products" className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold">
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Checkout</h1>
        <p className="text-xs text-slate-400 mt-1">Provide your delivery destination and confirm payment</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800/50 text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Truck size={16} className="text-[#8B5CF6]" />
              <span>1. Customer & Shipping Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Recipient Name *</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={shippingData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={shippingData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
              <input
                type="text"
                required
                name="phone"
                value={shippingData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Street Address *</label>
              <input
                type="text"
                required
                name="address"
                value={shippingData.address}
                onChange={handleChange}
                placeholder="Door No, Building, Street name"
                className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">City *</label>
                <input
                  type="text"
                  required
                  name="city"
                  value={shippingData.city}
                  onChange={handleChange}
                  placeholder="Chennai"
                  className="w-full px-3 py-2 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">State *</label>
                <input
                  type="text"
                  required
                  name="state"
                  value={shippingData.state}
                  onChange={handleChange}
                  placeholder="Tamil Nadu"
                  className="w-full px-3 py-2 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Pincode *</label>
                <input
                  type="text"
                  required
                  name="pincode"
                  value={shippingData.pincode}
                  onChange={handleChange}
                  placeholder="600001"
                  className="w-full px-3 py-2 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard size={16} className="text-[#E83E8C]" />
              <span>2. Payment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod('ONLINE')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'ONLINE'
                    ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/50'
                    : 'bg-[#0d0d12] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-950 text-[#B8C4FF]">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Mock Card / UPI</p>
                      <p className="text-[10px] text-slate-400">Instant Order Confirmation</p>
                    </div>
                  </div>
                  {paymentMethod === 'ONLINE' && <CheckCircle size={16} className="text-purple-400" />}
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/50'
                    : 'bg-[#0d0d12] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-950 text-[#14B8A6]">
                      <Banknote size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Cash on Delivery</p>
                      <p className="text-[10px] text-slate-400">Pay when package arrives</p>
                    </div>
                  </div>
                  {paymentMethod === 'COD' && <CheckCircle size={16} className="text-purple-400" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 shadow-2xl space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-4">
              Review Items ({cart.items.length})
            </h2>

            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {cart.items.map((item) => (
                <div key={item._id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate max-w-[180px]">
                    <span className="font-bold text-purple-300">{item.quantity}×</span>
                    <span className="text-slate-300 truncate">{item.product?.name}</span>
                  </div>
                  <span className="font-semibold text-white">
                    ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-white">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18%)</span>
                <span className="font-semibold text-white">₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="font-semibold text-white">
                  {shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${shipping}`}
                </span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
                <span className="font-bold text-white">Total Amount</span>
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#B8C4FF] to-[#E83E8C]">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#E83E8C] hover:opacity-95 shadow-lg shadow-purple-950/50 transition-all hover:scale-[1.01]"
            >
              <span>{loading ? 'Processing Order...' : 'Confirm and Place Order'}</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Guaranteed Safe Checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
