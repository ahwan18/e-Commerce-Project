/**
 * ProductCard Component
 *
 * Displays product information in a card format.
 * Designed with child-friendly large buttons and simple layout.
 *
 * You CAN modify the design and layout as needed.
 */

import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { Button } from './Button';

export const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Buka produk ${product.name}`}
      className="surface-card overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
      onClick={onViewDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewDetails();
        }
      }}
    >
      <div className="relative h-40 sm:h-52 bg-gray-100 w-full text-left">
        <img
          src={product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover"
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
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-2 line-clamp-2 min-h-[2.8rem]">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm sm:text-lg font-semibold text-blue-700">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-slate-600">Stok {product.stock}</span>
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          aria-label={`Tambah ${product.name} ke keranjang`}
          disabled={isOutOfStock}
          variant="primary"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
        >
          <ShoppingCart size={16} />
          <span>{isOutOfStock ? 'Habis' : 'Tambah'}</span>
        </Button>
      </div>
    </article>
  );
};
