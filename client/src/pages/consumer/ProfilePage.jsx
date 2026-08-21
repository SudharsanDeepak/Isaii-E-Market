import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, Check, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ProfilePage = () => {
  const { user, updateUserData } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [pincode, setPincode] = useState(user?.address?.pincode || '');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const updatePayload = {
        name,
        phone,
        address: { street, city, state, pincode }
      };

      if (password.trim()) {
        updatePayload.password = password;
      }

      const res = await api.put('/auth/profile', updatePayload);
      if (res.data.success) {
        updateUserData(res.data.user);
        setSuccess('Profile updated successfully');
        setPassword('');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Account Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your personal information, address, and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-[#121217] border border-white/10 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#B8C4FF] to-[#E83E8C] p-[2px] shadow-lg">
              <div className="w-full h-full bg-[#0d0d12] rounded-[14px] flex items-center justify-center text-2xl font-extrabold text-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{user?.name}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-950 text-[#B8C4FF] border border-purple-800/40">
                {user?.role}
              </span>
            </div>

            <div className="pt-4 border-t border-white/5 text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <Calendar size={13} />
              <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#121217] border border-white/10 shadow-2xl space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Edit Details
            </h2>

            {success && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-emerald-300 text-xs font-medium flex items-center gap-2">
                <Check size={16} />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/50 text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/80"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address (Read-only)</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/5 rounded-xl text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/80"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Street Address</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="123 Avenue"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Chennai"
                    className="w-full px-3 py-2 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/80"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Tamil Nadu"
                    className="w-full px-3 py-2 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/80"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="600001"
                    className="w-full px-3 py-2 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/80"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-300">Change Password (Leave blank to keep current)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password (min 6 characters)"
                  className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] hover:opacity-95 shadow-md shadow-purple-950/40 transition-all hover:scale-[1.01]"
              >
                <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
