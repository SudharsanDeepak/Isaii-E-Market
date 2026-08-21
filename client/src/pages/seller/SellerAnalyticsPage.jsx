import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Package, Award, PieChart } from 'lucide-react';
import api from '../../services/api';
import SellerSidebar from '../../components/seller/SellerSidebar';
import StatCard from '../../components/seller/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SellerAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/seller/analytics');
        if (res.data.success) {
          setData(res.data.analytics);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Crunching sales analytics..." />
      </div>
    );
  }

  const { totalRevenue = 0, totalOrders = 0, inventoryValue = 0, totalProducts = 0, bestSellers = [], categoryDistribution = {} } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <SellerSidebar />

        <div className="flex-1 w-full space-y-8">
          <div className="border-b border-white/10 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Sales Analytics & Insights</h1>
            <p className="text-xs text-slate-400 mt-1">Deep dive into commercial performance and merchandise demand</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Realized Revenue"
              value={`₹${totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              variant="purple"
            />
            <StatCard
              title="Orders Completed"
              value={totalOrders}
              icon={ShoppingBag}
              variant="pink"
            />
            <StatCard
              title="Inventory Asset Value"
              value={`₹${inventoryValue.toLocaleString()}`}
              icon={TrendingUp}
              variant="teal"
            />
            <StatCard
              title="Listed Catalog"
              value={`${totalProducts} items`}
              icon={Package}
              variant="amber"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <Award size={18} className="text-[#8B5CF6]" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Top Best-Selling Products
                </h2>
              </div>

              {bestSellers.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">No sales recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {bestSellers.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-[#0d0d12] border border-white/5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-extrabold text-xs text-purple-400">
                          #{idx + 1}
                        </span>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover bg-black/40"
                        />
                        <div className="truncate max-w-[150px] sm:max-w-[200px]">
                          <p className="text-xs font-bold text-white truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-400">{item.quantity} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-white">
                          ₹{item.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <PieChart size={18} className="text-[#E83E8C]" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Category Distribution
                </h2>
              </div>

              {Object.keys(categoryDistribution).length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">No category data available.</p>
              ) : (
                <div className="space-y-4 pt-2">
                  {Object.entries(categoryDistribution).map(([category, count]) => {
                    const percentage = Math.round((count / Math.max(1, totalProducts)) * 100);
                    return (
                      <div key={category} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-white">{category}</span>
                          <span className="text-slate-400">{count} products ({percentage}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#0d0d12] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#B8C4FF] to-[#E83E8C]"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAnalyticsPage;
