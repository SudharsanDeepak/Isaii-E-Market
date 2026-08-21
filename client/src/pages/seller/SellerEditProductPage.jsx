import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import api from '../../services/api';
import SellerSidebar from '../../components/seller/SellerSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const categoryOptions = [
  'Electronics',
  'Fashion',
  'Home',
  'Accessories',
  'Beauty',
  'Sports'
];

const SellerEditProductPage = () => {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          const p = res.data.product;
          setFormData({
            name: p.name || '',
            description: p.description || '',
            price: p.price !== undefined ? String(p.price) : '',
            category: p.category || 'Electronics',
            stock: p.stock !== undefined ? String(p.stock) : '',
            image: p.image || '',
            discount: p.discount !== undefined ? String(p.discount) : '0',
            brand: p.brand || 'Isaii'
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error loading product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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
      setSaving(true);
      setError('');

      const res = await api.put(`/products/${id}`, {
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
      setError(err.response?.data?.message || err.message || 'Error updating product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading product details..." />
      </div>
    );
  }

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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Edit Product</h1>
              <p className="text-xs text-slate-400 mt-0.5">Update catalog details, stock, or price points</p>
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
                    className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Stock Availability *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/80"
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
                    className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Product Image URL *</label>
                <input
                  type="url"
                  required
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/80"
                />
              </div>

              {formData.image && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-slate-300 mb-1.5">Preview:</p>
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
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] shadow-lg shadow-purple-950/40 hover:scale-[1.01] transition-all"
                >
                  <Save size={15} />
                  <span>{saving ? 'Saving...' : 'Save Product Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerEditProductPage;
