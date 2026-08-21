import React from 'react';
import ProductCard from './ProductCard';
import { PackageSearch } from 'lucide-react';

const ProductGrid = ({ products = [], loading = false, onResetFilters }) => {
  if (!loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-[#121217] border border-white/10 rounded-2xl my-8">
        <div className="p-4 rounded-2xl bg-purple-950/40 text-purple-300 border border-purple-800/40 mb-4">
          <PackageSearch size={36} />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No products found</h3>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          We could not find any products matching your active filters. Try searching for something else or resetting your criteria.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#E83E8C] rounded-xl hover:opacity-90 transition-opacity"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
