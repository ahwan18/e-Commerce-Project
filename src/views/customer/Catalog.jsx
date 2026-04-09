import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';
import { useCart } from '../../context/CartContext';
import { useCounter } from '../../context/CounterContext';
import { Button } from '../../components/Button';
import { formatPrice } from '../../utils/helpers';
import * as ProductController from '../../controllers/productController';

export const Catalog = () => {
  const navigate = useNavigate();
  const { addItem, cartCount, cartTotal } = useCart();
  const { counterName, mode } = useCounter();

  const [allProducts, setAllProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedMovements, setSelectedMovements] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await ProductController.fetchAllProducts();
      setAllProducts(productsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = useMemo(() => {
    const options = Array.from(
      new Set(allProducts.map((product) => product.parent_category).filter(Boolean))
    );
    return ['all', ...options];
  }, [allProducts]);

  const materialOptions = useMemo(() => {
    return Array.from(new Set(allProducts.map((p) => p.material).filter(Boolean)));
  }, [allProducts]);

  const sizeOptions = useMemo(() => {
    return Array.from(new Set(allProducts.map((p) => p.size).filter(Boolean)));
  }, [allProducts]);

  const themeOptions = useMemo(() => {
    return Array.from(new Set(allProducts.map((p) => p.gender_theme).filter(Boolean)));
  }, [allProducts]);

  const movementOptions = useMemo(() => {
    return Array.from(new Set(allProducts.map((p) => p.movement_type).filter(Boolean)));
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    if (activeCategory !== 'all') {
      products = products.filter((product) => product.parent_category === activeCategory);
    }

    if (availabilityFilter === 'ready') {
      products = products.filter((product) => product.stock > 0);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      products = products.filter((product) => product.name.toLowerCase().includes(query));
    }

    if (selectedMaterials.length > 0) {
      products = products.filter((product) => selectedMaterials.includes(product.material));
    }

    if (selectedSizes.length > 0) {
      products = products.filter((product) => selectedSizes.includes(product.size));
    }

    if (selectedThemes.length > 0) {
      products = products.filter((product) => selectedThemes.includes(product.gender_theme));
    }

    if (selectedMovements.length > 0) {
      products = products.filter((product) =>
        selectedMovements.includes(product.movement_type)
      );
    }

    if (sortBy === 'price_asc') {
      products.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price_desc') {
      products.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'name_asc') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }

    return products;
  }, [
    activeCategory,
    allProducts,
    availabilityFilter,
    searchQuery,
    selectedMaterials,
    selectedMovements,
    selectedSizes,
    selectedThemes,
    sortBy,
  ]);

  const toggleSelection = (value, selectedValues, setSelectedValues) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
      return;
    }
    setSelectedValues([...selectedValues, value]);
  };

  const handleAddToCart = (product) => {
    if (mode === 'browsing') {
      setNotification('Scan QR untuk mulai memesan.');
      return;
    }
    addItem(product, 1);
    setNotification('Ditambahkan ke keranjang!');
  };

  const handleViewDetails = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <main className="page-shell">
      <div className="page-container pb-28">
        {mode === 'browsing' && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl text-center font-medium">
            Preview Mode – Scan QR untuk mulai memesan
          </div>
        )}
        {notification && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-center font-medium">
            {notification}
          </div>
        )}

        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-2">Katalog Mainan</h1>
          <p className="text-slate-600">Pilih mainan favorit dan tambahkan ke keranjang.</p>
          {counterName && (
            <p className="text-sm text-blue-700 font-medium mt-2">Counter aktif: {counterName}</p>
          )}
        </header>

        <section className="mb-4" aria-label="Filter kategori cepat">
          <div className="surface-card p-3 mb-3">
            <label htmlFor="catalog-search" className="sr-only">
              Cari produk
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="catalog-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari mainan..."
                className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm"
                aria-label="Cari produk"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => setAvailabilityFilter(availabilityFilter === 'ready' ? 'all' : 'ready')}
                className={`px-3 py-2 rounded-full text-xs border min-h-11 ${
                  availabilityFilter === 'ready'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
                aria-label="Filter hanya stok tersedia"
              >
                Stok tersedia
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-full text-xs border min-h-11 bg-white text-slate-700 border-slate-200"
                aria-label="Urutkan produk"
              >
                <option value="recommended">Rekomendasi</option>
                <option value="price_asc">Harga Termurah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="name_asc">Nama A-Z</option>
              </select>
              <button
                type="button"
                onClick={() => setShowAdvancedFilters((prev) => !prev)}
                className={`px-3 py-2 rounded-full text-xs border min-h-11 ${
                  showAdvancedFilters
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
                aria-label="Tampilkan filter lanjutan"
              >
                Filter lanjutan
              </button>
            </div>

            {showAdvancedFilters && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">Material</p>
                  <div className="flex flex-wrap gap-2">
                    {materialOptions.map((material) => (
                      <button
                        key={material}
                        type="button"
                        onClick={() =>
                          toggleSelection(material, selectedMaterials, setSelectedMaterials)
                        }
                        className={`px-3 py-1.5 rounded-full text-xs border ${
                          selectedMaterials.includes(material)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {material}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">Ukuran</p>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSelection(size, selectedSizes, setSelectedSizes)}
                        className={`px-3 py-1.5 rounded-full text-xs border ${
                          selectedSizes.includes(size)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">Tema</p>
                  <div className="flex flex-wrap gap-2">
                    {themeOptions.map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => toggleSelection(theme, selectedThemes, setSelectedThemes)}
                        className={`px-3 py-1.5 rounded-full text-xs border ${
                          selectedThemes.includes(theme)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2">Gerakan</p>
                  <div className="flex flex-wrap gap-2">
                    {movementOptions.map((movement) => (
                      <button
                        key={movement}
                        type="button"
                        onClick={() =>
                          toggleSelection(
                            movement,
                            selectedMovements,
                            setSelectedMovements
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-xs border ${
                          selectedMovements.includes(movement)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {movement}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categoryOptions.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-label={`Pilih kategori ${category === 'all' ? 'Semua' : category}`}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border min-h-11 ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {category === 'all' ? 'Semua' : category}
                </button>
              );
            })}
          </div>
        </section>

        <section aria-label="Daftar produk">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="surface-card overflow-hidden animate-pulse">
                  <div className="h-40 sm:h-52 bg-slate-100" />
                  <div className="p-4">
                    <div className="h-4 bg-slate-100 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
                    <div className="h-9 bg-slate-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-14 surface-card">
              <p className="text-slate-600 text-lg">Produk tidak ditemukan.</p>
              <Button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                  setAvailabilityFilter('all');
                  setSortBy('recommended');
                  setSelectedMaterials([]);
                  setSelectedSizes([]);
                  setSelectedThemes([]);
                  setSelectedMovements([]);
                }}
                className="mt-4"
                aria-label="Reset pencarian dan filter"
              >
                Reset Filter
              </Button>
            </div>
          ) : (
            <>
              <p className="text-slate-600 mb-4 text-sm">
                Menampilkan {filteredProducts.length} produk
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewDetails={() => handleViewDetails(product.id)}
                    disableAddToCart={mode === 'browsing'}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {cartCount > 0 && mode === 'ordering' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-slate-200 backdrop-blur z-40">
          <div className="container mx-auto px-4 py-3">
            <Button
              onClick={() => navigate('/shop/cart')}
              variant="primary"
              size="lg"
              className="w-full"
              aria-label={`Buka keranjang, ${cartCount} item total ${formatPrice(cartTotal)}`}
            >
              Keranjang ({cartCount}) • {formatPrice(cartTotal)}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};
