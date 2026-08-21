import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, ArrowRight, CreditCard } from 'lucide-react';
import Badge from '../common/Badge';

const OrderCard = ({ order }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Shipped':
        return 'teal';
      case 'Processing':
        return 'purple';
      case 'Confirmed':
        return 'pink';
      case 'Cancelled':
        return 'danger';
      default:
        return 'warning';
    }
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-[#121217] border border-white/10 hover:border-purple-500/30 rounded-2xl p-5 transition-all space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Package size={16} className="text-[#8B5CF6]" />
            <span className="text-xs font-mono text-slate-300">
              #{order._id.slice(-8).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Calendar size={13} />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={getStatusVariant(order.orderStatus)}>
            {order.orderStatus}
          </Badge>
          <Link
            to={`/orders/${order._id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-white/10 hover:bg-gradient-to-r hover:from-[#8B5CF6] hover:to-[#E83E8C] rounded-xl transition-all"
          >
            <span>View Order</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-[#0d0d12] border border-white/5 pr-4"
          >
            <img
              src={item.image || item.product?.image}
              alt={item.name}
              className="w-10 h-10 rounded-lg object-cover bg-black/40"
            />
            <div>
              <p className="text-xs font-semibold text-white truncate max-w-[150px]">{item.name}</p>
              <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <CreditCard size={14} className="text-slate-500" />
          <span>{order.paymentMethod === 'ONLINE' ? 'Card / Online' : 'Cash on Delivery'}</span>
          <span className="text-slate-600">•</span>
          <span className={order.paymentStatus === 'Completed' ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
            {order.paymentStatus}
          </span>
        </div>

        <div className="text-right">
          <span className="text-slate-400 mr-2">Total Amount:</span>
          <span className="text-sm font-extrabold text-white">₹{order.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
