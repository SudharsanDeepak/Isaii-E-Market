import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const loggedInUser = await login(email, password);

      if (from) {
        navigate(from, { replace: true });
      } else if (loggedInUser?.role === 'seller') {
        navigate('/seller/dashboard', { replace: true });
      } else {
        navigate('/products', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (userType) => {
    if (userType === 'consumer') {
      setEmail('consumer@isaii.com');
      setPassword('Password123!');
    } else {
      setEmail('seller@isaii.com');
      setPassword('Password123!');
    }
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/30 to-[#E83E8C]/30 border border-white/10 mb-2">
            <Shield size={28} className="text-[#B8C4FF]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400">Log in to your verified Isaii Market account</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#121218] border border-white/10 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8B5CF6]">
            <Sparkles size={13} />
            <span>Instant Demo Fill</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('consumer')}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-purple-950/50 hover:border-purple-500/50 border border-white/10 text-xs font-semibold text-slate-200 transition-all text-left flex items-center gap-2"
            >
              <UserCheck size={14} className="text-purple-400" />
              <div>
                <p className="font-bold text-white text-[11px]">Consumer</p>
                <p className="text-[9px] text-slate-400">consumer@isaii.com</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('seller')}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-pink-950/50 hover:border-pink-500/50 border border-white/10 text-xs font-semibold text-slate-200 transition-all text-left flex items-center gap-2"
            >
              <Shield size={14} className="text-pink-400" />
              <div>
                <p className="font-bold text-white text-[11px]">Seller</p>
                <p className="text-[9px] text-slate-400">seller@isaii.com</p>
              </div>
            </button>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#121217] border border-white/10 shadow-2xl space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/50 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#E83E8C] hover:opacity-95 shadow-lg shadow-purple-950/50 transition-all hover:scale-[1.01]"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#B8C4FF] hover:text-white transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
