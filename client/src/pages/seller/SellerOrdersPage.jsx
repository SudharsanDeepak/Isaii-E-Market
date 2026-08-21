import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Check, AlertCircle, MapPin } from 'lucide-react';
import api from '../../services/api';
import SellerSidebar from '../../components/seller/SellerSidebar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [message, setMessage] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/seller/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      setMessage('');
      const res = await api.put(`/seller/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        setMessage(`Order status updated to ${newStatus}`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Error updating order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filterStatus === 'All' || o.orderStatus === filterStatus;
    const matchesSearch =
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.consumer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusVariant = (st) => {
    switch (st) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <SellerSidebar />

        <div className="flex-1 w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Order Management</h1>
              <p className="text-xs text-slate-400 mt-1">Review orders and update customer fulfillment progression</p>
            </div>
          </div>

          {message && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check size={16} />
              <span>{message}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Order ID or Buyer..."
                className="w-full pl-10 pr-4 py-2 bg-[#121217] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 bg-[#121217] p-1 rounded-xl border border-white/10 w-full sm:w-auto">
              {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filterStatus === st
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <LoadingSpinner text="Fetching merchant orders..." />
            ) : filteredOrders.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#121217] border border-white/10 text-center space-y-3">
                <ShoppingBag size={32} className="mx-auto text-slate-500" />
                <h3 className="text-sm font-bold text-white">No orders matching criteria</h3>
                <p className="text-xs text-slate-400">Incoming purchase orders will be listed here.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4 shadow-lg"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-white">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <Badge variant={getStatusVariant(order.orderStatus)}>
                          {order.orderStatus}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Buyer: <span className="text-white font-medium">{order.consumer?.name || order.shippingAddress.fullName}</span> ({order.consumer?.email || order.shippingAddress.email}) • Placed {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-400">Update Status:</span>
                      <select
                        value={order.orderStatus}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="px-3 py-1.5 bg-[#0d0d12] border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <p className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                        Order Items
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 rounded-xl bg-[#0d0d12] border border-white/5"
                          >
                            <img
                              src={item.image || item.product?.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover bg-black/40"
                            />
                            <div className="truncate">
                              <p className="font-semibold text-white truncate">{item.name}</p>
                              <p className="text-slate-400 text-[11px]">
                                Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#8B5CF6]" />
                        <span>Delivery Destination</span>
                      </p>
                      <div className="p-3 rounded-2xl bg-[#0d0d12] border border-white/5 space-y-1 text-slate-300">
                        <p className="font-bold text-white">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        <p className="text-slate-400 text-[11px]">Contact: {order.shippingAddress.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-400">
                    <div>
                      Payment: <span className="font-semibold text-white">{order.paymentMethod}</span> ({order.paymentStatus})
                    </div>
                    <div>
                      Total: <span className="text-sm font-extrabold text-white">₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrdersPage;
