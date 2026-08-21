import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Boxes, Plus, Edit3, Search, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import SellerSidebar from '../../components/seller/SellerSidebar';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SellerInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/seller/products');
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQuickAddStock = async (product, amount) => {
    try {
      setUpdatingId(product._id);
      const newStock = Math.max(0, product.stock + amount);
      const res = await api.put(`/products/${product._id}`, { stock: newStock });
      if (res.data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, stock: newStock } : p))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Error updating stock');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <SellerSidebar />

        <div className="flex-1 w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Inventory Monitor</h1>
              <p className="text-xs text-slate-400 mt-1">Real-time inventory levels, health badges, and stock adjustment</p>
            </div>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product inventory..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#121217] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
            />
          </div>

          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10">
            {loading ? (
              <LoadingSpinner text="Analyzing inventory levels..." />
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Boxes size={32} className="mx-auto text-slate-500" />
                <h3 className="text-sm font-bold text-white">No inventory items</h3>
                <p className="text-xs text-slate-400">Listed products will be tracked here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-3 font-semibold">Product</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Current Stock</th>
                      <th className="pb-3 font-semibold">Health Status</th>
                      <th className="pb-3 font-semibold">Quick Restock</th>
                      <th className="pb-3 font-semibold text-right">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map((p) => {
                      const isOut = p.stock <= 0;
                      const isLow = p.stock > 0 && p.stock <= 10;
                      const isGood = p.stock > 10;

                      return (
                        <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-black/40 shrink-0"
                            />
                            <span className="font-bold text-white max-w-[180px] truncate">{p.name}</span>
                          </td>
                          <td className="py-3 text-slate-300">{p.category}</td>
                          <td className="py-3">
                            <span className="font-extrabold text-sm text-white">{p.stock}</span> units
                          </td>
                          <td className="py-3">
                            {isOut ? (
                              <Badge variant="danger">Out of Stock (0)</Badge>
                            ) : isLow ? (
                              <Badge variant="warning">Low Stock (1-10)</Badge>
                            ) : (
                              <Badge variant="success">In Stock (&gt;10)</Badge>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleQuickAddStock(p, 5)}
                                disabled={updatingId === p._id}
                                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-[11px] font-bold transition-colors"
                              >
                                +5
                              </button>
                              <button
                                onClick={() => handleQuickAddStock(p, 20)}
                                disabled={updatingId === p._id}
                                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-[11px] font-bold transition-colors"
                              >
                                +20
                              </button>
                              <button
                                onClick={() => handleQuickAddStock(p, 50)}
                                disabled={updatingId === p._id}
                                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-[11px] font-bold transition-colors"
                              >
                                +50
                              </button>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <Link
                              to={`/seller/products/edit/${p._id}`}
                              className="inline-flex p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                            >
                              <Edit3 size={14} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
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

export default SellerInventoryPage;
