/**
 * ProductCard Component
 *
 * Displays product information in a card format.
 * Designed with child-friendly large buttons and simple layout.
 *
 * You CAN modify the design and layout as needed.
 */

import { ShoppingCart, Eye } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { Button } from './Button';

export const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Buka produk ${product.name}`}
      className="surface-card overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex flex-col h-full group"
      onClick={onViewDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails();
        }
      }}
    >
      <div className="relative h-40 sm:h-52 bg-gray-100 w-full text-left overflow-hidden">
        <img
          src={product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-base">
              Habis
            </span>
          </div>
        )}
        {!isOutOfStock && product.stock <= 5 && (
          <span className="absolute top-2 left-2 text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded-full border border-amber-200">
            Stok terbatas
          </span>
        )}
        
        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="bg-white text-indigo-600 rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg pointer-events-auto">
             <Eye size={20} />
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-2 line-clamp-2 flex-grow">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm sm:text-lg font-bold text-blue-700">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-medium">Stok {product.stock}</span>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            variant="secondary"
            size="sm"
            className="flex-1 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
          >
            Detail
          </Button>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(e, product);
            }}
            aria-label={`Tambah ${product.name} ke keranjang`}
            disabled={isOutOfStock}
            variant="primary"
            size="sm"
            className="flex-[2] flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            <span>{isOutOfStock ? 'Habis' : 'Tambah'}</span>
          </Button>
        </div>
      </div>
    </article>
  );
};
