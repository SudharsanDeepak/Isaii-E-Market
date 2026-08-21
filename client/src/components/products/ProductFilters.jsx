import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, Star } from 'lucide-react';

const ProductFilters = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  onReset
}) => {
  return (
    <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-[#8B5CF6]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Refine Search</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-purple-300 transition-colors"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Keyword Search</label>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search headphones, watch..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500/80 transition-colors"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Categories</label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] text-white shadow-sm shadow-purple-950'
                : 'bg-[#0d0d12] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] text-white shadow-sm shadow-purple-950'
                  : 'bg-[#0d0d12] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Price Range (₹)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 bg-[#0d0d12] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/80"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Minimum Rating</label>
        <div className="grid grid-cols-4 gap-1.5">
          {[4, 3, 2, 0].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(rating === 0 ? '' : rating)}
              className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                (rating === 0 && !minRating) || minRating === rating
                  ? 'bg-purple-950/60 border-purple-600 text-purple-200'
                  : 'bg-[#0d0d12] border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span>{rating === 0 ? 'All' : `${rating}+`}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
