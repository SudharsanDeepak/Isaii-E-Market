import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Boxes,
  TrendingUp,
  Store
} from 'lucide-react';

const SellerSidebar = () => {
  const links = [
    { to: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/seller/products', label: 'All Products', icon: Package },
    { to: '/seller/products/add', label: 'Add Product', icon: PlusCircle },
    { to: '/seller/inventory', label: 'Inventory Monitor', icon: Boxes },
    { to: '/seller/orders', label: 'Manage Orders', icon: ShoppingBag },
    { to: '/seller/analytics', label: 'Sales Analytics', icon: TrendingUp }
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#101015] border border-white/10 rounded-2xl p-4 lg:sticky lg:top-28 h-fit space-y-6">
      <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10">
        <div className="p-2 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#0F766E] text-white">
          <Store size={20} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white leading-tight">Merchant Portal</h2>
          <p className="text-[11px] text-purple-300 font-medium">Isaii Seller Suite</p>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/seller/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] text-white shadow-md shadow-purple-950/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default SellerSidebar;
