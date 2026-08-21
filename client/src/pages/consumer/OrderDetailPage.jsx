import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, ArrowLeft, MapPin, CreditCard, ShieldCheck, Phone, Mail } from 'lucide-react';
import api from '../../services/api';
import OrderTimeline from '../../components/orders/OrderTimeline';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Fetching order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Order not found</h2>
        <Link to="/orders" className="inline-block px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold">
          View All Orders
        </Link>
      </div>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Shipped':
        return 'teal';
      case 'Processing':
        return 'purple';
      case 'Confirmed':
        return 'pink';
      case 'Cancelled':
        return 'danger';
      default:
        return 'warning';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-3">
              <span>Order #{order._id.slice(-8).toUpperCase()}</span>
              <Badge variant={getStatusVariant(order.orderStatus)}>
                {order.orderStatus}
              </Badge>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'full' })}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Order Tracking Status
        </h2>
        <OrderTimeline currentStatus={order.orderStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Ordered Items ({order.items.length})
            </h2>

            <div className="divide-y divide-white/5">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || item.product?.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-black/40"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin size={16} className="text-[#8B5CF6]" />
              <span>Delivery Address</span>
            </h2>

            <div className="bg-[#0d0d12] p-4 rounded-2xl border border-white/5 space-y-1.5 text-xs text-slate-300">
              <p className="font-bold text-white text-sm">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-slate-400">
                <span className="flex items-center gap-1">
                  <Phone size={13} className="text-[#8B5CF6]" />
                  {order.shippingAddress.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail size={13} className="text-[#E83E8C]" />
                  {order.shippingAddress.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Payment & Invoice
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Method</span>
                <span className="font-semibold text-white">
                  {order.paymentMethod === 'ONLINE' ? 'Mock Card / Online' : 'Cash on Delivery'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Status</span>
                <span className={order.paymentStatus === 'Completed' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-white">₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (GST 18%)</span>
                <span className="font-semibold text-white">₹{order.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="font-semibold text-white">
                  {order.shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${order.shipping}`}
                </span>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
                <span className="font-bold text-white">Grand Total</span>
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#B8C4FF] to-[#E83E8C]">
                  ₹{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
