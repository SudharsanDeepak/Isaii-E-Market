import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, RefreshCw } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0e] border-t border-white/10 pt-16 pb-12 mt-auto text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-3 rounded-xl bg-purple-950/50 text-[#B8C4FF] border border-purple-800/40">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Fast Delivery</h4>
              <p className="text-xs text-slate-400">Free delivery on orders over ₹1,000</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-3 rounded-xl bg-pink-950/50 text-[#E83E8C] border border-pink-800/40">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400">Encrypted token transactions</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-3 rounded-xl bg-teal-950/50 text-[#14B8A6] border border-teal-800/40">
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Verified Merchants</h4>
              <p className="text-xs text-slate-400">Strict authentic vendor audit</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="p-3 rounded-xl bg-purple-950/50 text-[#8B5CF6] border border-purple-800/40">
              <Headphones size={24} />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Dedicated Support</h4>
              <p className="text-xs text-slate-400">Priority digital assistance</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#E83E8C] flex items-center justify-center font-bold text-white text-sm">
                I
              </div>
              <span className="text-lg font-bold text-white tracking-wide">Isaii E-Commerce</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering digital commerce through next-generation architecture, seamless buyer journeys, and verified merchant enablement.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Explore Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=Fashion" className="hover:text-white transition-colors">
                  Fashion & Lifestyle
                </Link>
              </li>
              <li>
                <Link to="/products?category=Home" className="hover:text-white transition-colors">
                  Home & Living
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">For Sellers</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/seller/dashboard" className="hover:text-white transition-colors">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link to="/seller/products" className="hover:text-white transition-colors">
                  Inventory Management
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Legal & Security</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-white cursor-pointer transition-colors">Consumer Protection</li>
              <li className="hover:text-white cursor-pointer transition-colors">Compliance</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Isaii E-Commerce Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400 font-medium">Design & Powered by Isaii</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
