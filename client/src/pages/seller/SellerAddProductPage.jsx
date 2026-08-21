import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import SellerSidebar from '../../components/seller/SellerSidebar';

const categoryOptions = [
  'Electronics',
  'Fashion',
  'Home',
  'Accessories',
  'Beauty',
  'Sports'
];

const sampleImages = [
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
  { label: 'Laptop Stand', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' }
];

const SellerAddProductPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
    image: '',
    discount: '0',
    brand: 'Isaii'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      setError('Please fill in all required product fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await api.post('/products', {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock) || 0,
        image: formData.image,
        discount: Number(formData.discount) || 0,
        brand: formData.brand || 'Isaii'
      });

      if (res.data.success) {
        navigate('/seller/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <SellerSidebar />

        <div className="flex-1 w-full space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Link
              to="/seller/products"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Create New Product</h1>
              <p className="text-xs text-slate-400 mt-0.5">List a new item in the Isaii store catalog</p>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800/50 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="p-6 sm:p-8 rounded-3xl bg-[#121217] border border-white/10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Product Title *</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Wireless ANC Studio Headphones"
                  className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Description *</label>
                <textarea
                  required
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detail the product specifications, features, and package contents..."
                  className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 custom-scrollbar"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/80"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="2999"
                    className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="25"
                    className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Brand / Manufacturer</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Isaii"
                    className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Product Image URL *</label>
                  <span className="text-[10px] text-slate-400">Direct image link (Unsplash or CDN)</span>
                </div>
                <input
                  type="url"
                  required
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Sparkles size={11} className="text-[#8B5CF6]" />
                    Quick Sample Presets:
                  </span>
                  {sampleImages.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: s.url })}
                      className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 hover:text-white transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {formData.image && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-slate-300 mb-1.5">Image Preview:</p>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-24 h-24 rounded-xl object-cover border border-white/10 bg-black/40"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <Link
                  to="/seller/products"
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] shadow-lg shadow-purple-950/40 hover:scale-[1.01] transition-all"
                >
                  <PlusCircle size={15} />
                  <span>{loading ? 'Creating...' : 'Publish Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAddProductPage;
