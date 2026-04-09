/**
 * ProductDetail View (Customer)
 *
 * Displays detailed information about a single product.
 *
 * NO business logic should be in this component - only UI.
 * All logic is handled through controllers.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Minus, Plus, Maximize2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { QRCodeDisplay } from '../../components/QRCodeDisplay';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import * as ProductController from '../../controllers/productController';
import { useCounter } from '../../context/CounterContext';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { mode } = useCounter();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await ProductController.fetchProductDetails(id);
      setProduct(productData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (mode === 'browsing') {
      alert('Scan QR untuk mulai memesan.');
      return;
    }
    const success = addItem(product, quantity);
    if (success) {
      navigate('/shop/cart');
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <Loading message="Memuat detail produk..." />
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl" role="alert">
            {error || 'Produk tidak ditemukan'}
          </div>
          <Button
            onClick={() => navigate('/shop')}
            variant="secondary"
            className="mt-4"
            aria-label="Kembali ke katalog"
          >
            Kembali ke Katalog
          </Button>
        </div>
      </main>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <main className="page-shell">
      <div className="page-container pb-24">
        <Button
          onClick={() => navigate('/shop')}
          variant="secondary"
          size="sm"
          className="mb-6 flex items-center gap-2"
          aria-label="Kembali ke katalog"
        >
          <ArrowLeft size={18} />
          Kembali
        </Button>

        <article className="surface-card overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-4 sm:p-8">
            <div className="flex flex-col gap-6">
              <div className="relative">
                <img
                  src={product.image_url || 'https://via.placeholder.com/500x500?text=No+Image'}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-2xl"
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center">
                    <span className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg">
                      Stok Habis
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowQRModal(true)}
                className="w-full bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 hover:border-green-300 rounded-2xl p-4 transition-all text-center group min-h-11"
                aria-label="Lihat QR code produk"
              >
                <Maximize2 size={20} className="mx-auto mb-2 text-green-600 group-hover:text-green-700 transition-colors" />
                <p className="text-sm font-semibold text-green-700 group-hover:text-green-800">
                  Lihat QR Code
                </p>
              </button>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
                  {product.name}
                </h1>

                {product.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    {product.category.name}
                  </span>
                )}

                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {product.description || 'Tidak ada deskripsi'}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </span>
                  <p className="text-slate-600 mt-2">
                    Stok tersedia: {product.stock} unit
                  </p>
                </div>
              </div>

              {!isOutOfStock && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-lg font-semibold text-gray-700">
                      Jumlah:
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={decrementQuantity}
                        className="bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors min-h-11 min-w-11"
                        disabled={quantity <= 1}
                        aria-label="Kurangi jumlah"
                      >
                        <Minus size={24} />
                      </button>
                      <span className="text-2xl font-bold w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className="bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors min-h-11 min-w-11"
                        disabled={quantity >= product.stock}
                        aria-label="Tambah jumlah"
                      >
                        <Plus size={24} />
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    size="xl"
                    className="w-full flex items-center justify-center gap-3"
                    aria-label={`Tambah ${product.name} ke keranjang`}
                  >
                    <ShoppingCart size={24} />
                    Tambah ke Keranjang
                  </Button>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>

      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="surface-card max-w-md w-full p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                Bagikan Produk
              </h2>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl min-h-11 min-w-11"
                aria-label="Tutup modal QR"
              >
                ×
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              Scan QR code untuk membagikan produk ini:
            </p>

            <QRCodeDisplay
              value={`${window.location.origin}/shop/product/${product.id}`}
              label={`Scan to view: ${product.name}`}
              fileName={`qr-${product.name.replace(/\s+/g, '-')}.svg`}
            />

            <Button
              onClick={() => setShowQRModal(false)}
              variant="secondary"
              size="lg"
              className="w-full mt-6"
              aria-label="Tutup"
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};
