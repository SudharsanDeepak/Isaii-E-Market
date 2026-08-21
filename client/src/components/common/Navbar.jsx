import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Package,
  Menu,
  X,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isSeller, isConsumer, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-[#050505]/85 backdrop-blur-md border-b border-white/10 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] via-[#B8C4FF] to-[#E83E8C] p-[2px] shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-[#0d0d11] rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#B8C4FF] to-[#E83E8C] text-xl">
                    I
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  Isaii <span className="text-xs px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 font-semibold border border-purple-800/40 uppercase tracking-widest">Market</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">Next-Gen Commerce</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/products') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Products
              </Link>
              {isAuthenticated && isConsumer && (
                <Link
                  to="/orders"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/orders') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  My Orders
                </Link>
              )}
              {isAuthenticated && isSeller && (
                <>
                  <Link
                    to="/seller/dashboard"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/seller/dashboard') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/seller/products"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/seller/products') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    My Inventory
                  </Link>
                  <Link
                    to="/seller/orders"
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/seller/orders') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Orders
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/products"
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] rounded-xl hover:opacity-95 shadow-md shadow-purple-900/30 transition-all hover:scale-[1.02]"
            >
              Explore Products
            </Link>

            {(!isAuthenticated || isConsumer) && (
              <Link
                to="/cart"
                className="relative p-2.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors border border-white/5"
                title="Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#E83E8C] to-[#8B5CF6] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#141419] border border-white/10 hover:border-purple-500/40 text-slate-200 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#0F766E] flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-white leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-purple-300 font-medium capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/50 uppercase">
                        {user?.role}
                      </span>
                    </div>

                    {isConsumer && (
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        >
                          <User size={16} className="text-purple-400" />
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        >
                          <Package size={16} className="text-pink-400" />
                          My Orders
                        </Link>
                      </>
                    )}

                    {isSeller && (
                      <>
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        >
                          <LayoutDashboard size={16} className="text-teal-400" />
                          Seller Dashboard
                        </Link>
                        <Link
                          to="/seller/products"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        >
                          <Layers size={16} className="text-purple-400" />
                          Products & Inventory
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors text-left"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 md:hidden">
            {(!isAuthenticated || isConsumer) && (
              <Link to="/cart" className="relative p-2 text-slate-300 hover:text-white">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E83E8C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass-dropdown border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
          >
            Products
          </Link>

          {isAuthenticated ? (
            <>
              {isConsumer && (
                <>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
                  >
                    Profile ({user?.name})
                  </Link>
                </>
              )}
              {isSeller && (
                <>
                  <Link
                    to="/seller/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
                  >
                    Seller Dashboard
                  </Link>
                  <Link
                    to="/seller/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
                  >
                    Manage Products
                  </Link>
                  <Link
                    to="/seller/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
                  >
                    Seller Orders
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-base font-medium text-rose-400 hover:bg-rose-950/40 rounded-xl"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-semibold text-slate-200 bg-white/5 border border-white/10 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] rounded-xl shadow-lg"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
