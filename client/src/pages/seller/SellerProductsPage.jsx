import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, Package, Search, Sparkles, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import SellerSidebar from '../../components/seller/SellerSidebar';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const fetchSellerProducts = async () => {
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
    fetchSellerProducts();
  }, []);

  const handleSeedDemoProducts = async () => {
    try {
      setSeeding(true);
      setFeedbackMsg('');
      const res = await api.post('/seller/seed-demo');
      if (res.data.success) {
        setFeedbackMsg(res.data.message || 'Sample products successfully imported!');
        fetchSellerProducts();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to seed sample products.');
    } finally {
      setSeeding(false);
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      const res = await api.delete(`/products/${productToDelete._id}`);
      if (res.data.success) {
        setProducts(products.filter((p) => p._id !== productToDelete._id));
        setDeleteModalOpen(false);
        setProductToDelete(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Product Management</h1>
              <p className="text-xs text-slate-400 mt-1">Manage listings, edit prices, stock, and categories</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleSeedDemoProducts}
                disabled={seeding || loading}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs text-purple-200 bg-white/5 hover:bg-purple-950/40 border border-purple-500/30 hover:border-purple-500/60 shadow-sm transition-all disabled:opacity-50"
                title="Populate demo products into this seller account"
              >
                <Sparkles size={14} className={seeding ? 'animate-spin text-purple-400' : 'text-purple-400'} />
                <span>{seeding ? 'Seeding...' : 'Load Sample Products'}</span>
              </button>

              <Link
                to="/seller/products/add"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] shadow-md shadow-purple-950/40 hover:scale-[1.02] transition-all"
              >
                <PlusCircle size={15} />
                <span>Add New Product</span>
              </Link>
            </div>
          </div>

          {feedbackMsg && (
            <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
              <span>{feedbackMsg}</span>
              <button onClick={() => setFeedbackMsg('')} className="text-emerald-400 font-bold ml-4">✕</button>
            </div>
          )}

          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your listed products..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#121217] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
            />
          </div>

          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10">
            {loading ? (
              <LoadingSpinner text="Fetching products..." />
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 space-y-4 max-w-md mx-auto">
                <div className="inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400">
                  <Package size={36} className="text-[#8B5CF6]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">No products found in this store</h3>
                  <p className="text-xs text-slate-400">
                    You are logged into a custom merchant account. You can create your first product or instantly import ready-made demo products to explore the dashboard.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSeedDemoProducts}
                    disabled={seeding}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] shadow-lg shadow-purple-950/40 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    <Sparkles size={14} />
                    <span>{seeding ? 'Importing Sample Data...' : 'Import Sample Inventory (1-Click)'}</span>
                  </button>
                  <Link
                    to="/seller/products/add"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    <PlusCircle size={14} />
                    <span>Create Custom Listing</span>
                  </Link>
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  💡 Tip: The pre-seeded demo catalog is also directly accessible by logging into the demo seller account (<code className="text-slate-400">seller@isaii.com</code> / <code className="text-slate-400">Password123!</code>).
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-3 font-semibold">Image</th>
                      <th className="pb-3 font-semibold">Product Name</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Price</th>
                      <th className="pb-3 font-semibold">Stock</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map((p) => {
                      const isOutOfStock = p.stock <= 0;
                      const isLowStock = p.stock > 0 && p.stock <= 10;

                      return (
                        <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover bg-black/40"
                            />
                          </td>
                          <td className="py-3 max-w-[200px]">
                            <p className="font-bold text-white truncate">{p.name}</p>
                            <p className="text-[11px] text-slate-400">{p.brand || 'Isaii'}</p>
                          </td>
                          <td className="py-3 text-slate-300">{p.category}</td>
                          <td className="py-3 font-bold text-white">₹{p.price.toLocaleString()}</td>
                          <td className="py-3 text-slate-300">{p.stock}</td>
                          <td className="py-3">
                            {isOutOfStock ? (
                              <Badge variant="danger" size="sm">Out of Stock</Badge>
                            ) : isLowStock ? (
                              <Badge variant="warning" size="sm">Low Stock</Badge>
                            ) : (
                              <Badge variant="success" size="sm">In Stock</Badge>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <Link
                                to={`/seller/products/edit/${p._id}`}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 size={14} />
                              </Link>
                              <button
                                onClick={() => confirmDelete(p)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-rose-950/50 text-slate-300 hover:text-rose-400 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
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

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Product Deletion"
      >
        <div className="space-y-4 text-xs text-slate-300">
          <p>
            Are you sure you want to permanently remove{' '}
            <span className="font-bold text-white">"{productToDelete?.name}"</span>?
          </p>
          <p className="text-slate-400">
            This action cannot be undone and will remove the item from consumer browsing.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors"
            >
              {deleting ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SellerProductsPage;
