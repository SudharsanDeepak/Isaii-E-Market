import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  Boxes,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import SellerSidebar from '../../components/seller/SellerSidebar';
import StatCard from '../../components/seller/StatCard';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SellerDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/seller/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSeedDemoProducts = async () => {
    try {
      setSeeding(true);
      const res = await api.post('/seller/seed-demo');
      if (res.data.success) {
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to seed sample products.');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading seller analytics..." />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <SellerSidebar />

        <div className="flex-1 w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Seller Dashboard</h1>
              <p className="text-xs text-slate-400 mt-1">Real-time overview of products, revenues, and orders</p>
            </div>

            <div className="flex items-center gap-2.5">
              {stats.totalProducts === 0 && (
                <button
                  type="button"
                  onClick={handleSeedDemoProducts}
                  disabled={seeding}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs text-purple-200 bg-white/5 hover:bg-purple-950/40 border border-purple-500/30 hover:border-purple-500/60 shadow-sm transition-all disabled:opacity-50"
                  title="Populate demo products into this seller account"
                >
                  <Sparkles size={14} className={seeding ? 'animate-spin text-purple-400' : 'text-purple-400'} />
                  <span>{seeding ? 'Importing...' : 'Load Sample Products'}</span>
                </button>
              )}

              <Link
                to="/seller/products/add"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] shadow-md shadow-purple-950/40 hover:scale-[1.02] transition-all"
              >
                <PlusCircle size={15} />
                <span>Add New Product</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatCard
              title="Total Revenue"
              value={`₹${(stats.totalSales || 0).toLocaleString()}`}
              icon={TrendingUp}
              variant="purple"
              description="Gross sales from fulfilled orders"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders || 0}
              icon={ShoppingBag}
              variant="pink"
              description="Received customer orders"
            />
            <StatCard
              title="Pending Orders"
              value={stats.pendingOrders || 0}
              icon={Clock}
              variant="amber"
              description="Awaiting confirmation/dispatch"
            />
            <StatCard
              title="Active Catalog"
              value={stats.totalProducts || 0}
              icon={Package}
              variant="teal"
              description="Live listed products"
            />
            <StatCard
              title="Low Stock Alert"
              value={stats.lowStockProducts || 0}
              icon={AlertTriangle}
              variant="amber"
              description="Products with ≤ 10 inventory"
            />
            <StatCard
              title="Out of Stock"
              value={stats.outOfStockProducts || 0}
              icon={Boxes}
              variant="pink"
              description="Requires immediate restocking"
            />
          </div>

          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Recent Store Orders
                </h2>
                <p className="text-xs text-slate-400">Latest incoming purchase orders</p>
              </div>

              <Link
                to="/seller/orders"
                className="flex items-center gap-1 text-xs font-bold text-[#B8C4FF] hover:text-white transition-colors"
              >
                <span>Manage Orders</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No orders received yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-3 font-semibold">Order ID</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Items</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 font-mono text-slate-300">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-3.5 text-white font-medium">
                          {order.consumer?.name || 'Customer'}
                        </td>
                        <td className="py-3.5 text-slate-400">
                          {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                        </td>
                        <td className="py-3.5 font-extrabold text-white">
                          ₹{order.total.toLocaleString()}
                        </td>
                        <td className="py-3.5">
                          <Badge
                            variant={
                              order.orderStatus === 'Delivered'
                                ? 'success'
                                : order.orderStatus === 'Cancelled'
                                ? 'danger'
                                : 'purple'
                            }
                            size="sm"
                          >
                            {order.orderStatus}
                          </Badge>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            to="/seller/orders"
                            className="text-[#B8C4FF] hover:text-white font-bold hover:underline"
                          >
                            Update
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
