import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { formatPrice } from '../../../utils/helpers';
import * as ProductController from '../../../controllers/productController';

export const Catalog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem, cartCount, cartTotal } = useCart();

  const initialCategory = searchParams.get('category') || 'all';

  const [allProducts, setAllProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  
  // Minimal filters for Mode 2
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // If URL params change, update state
    const cat = searchParams.get('category') || 'all';
    setActiveCategory(cat);
  }, [searchParams]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await ProductController.fetchAllProducts();
      setAllProducts(productsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const categoryOptions = useMemo(() => {
    // Collect both category_id names (from db mapping) or parent_category
    // For simplicity, we just use parent_category for the UI pills
    const options = Array.from(
      new Set(allProducts.map((product) => product.parent_category).filter(Boolean))
    );
    return ['all', ...options];
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by Category (checks both ID mapping if URL passed an ID, or parent_category text)
    if (activeCategory !== 'all') {
      products = products.filter((product) => 
        product.parent_category === activeCategory || 
        product.category_id?.toString() === activeCategory
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      products = products.filter((product) => product.name.toLowerCase().includes(query));
    }

    if (sortBy === 'price_asc') {
      products.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price_desc') {
      products.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'name_asc') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }

    return products;
  }, [activeCategory, allProducts, searchQuery, sortBy]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const success = addItem(product, 1);
    if (success) {
      showNotification(`${product.name} added!`);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] font-sans">
      {notification && (
        <div className="fixed top-20 right-4 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl z-50 animate-bounce font-bold border-2 border-emerald-400">
          ✨ {notification}
        </div>
      )}

      {/* Playful Header */}
      <div className="bg-[#4F46E5] text-white pt-12 pb-24 rounded-b-[3rem] px-4 relative overflow-hidden shadow-md">
         <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
         <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-4">The Toy Catalog</h1>
            <p className="text-indigo-100 font-medium">Find your next great adventure.</p>
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-32">
        
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-xl border-2 border-slate-100 mb-10 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for toys..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-100 text-slate-700 font-medium outline-none transition-all"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative flex-grow md:flex-grow-0">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-48 pl-12 pr-10 py-4 rounded-xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-100 text-slate-700 font-medium outline-none appearance-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price_asc">Lowest Price</option>
                <option value="price_desc">Highest Price</option>
                <option value="name_asc">A - Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto pb-6 mb-4 hide-scrollbar">
          {categoryOptions.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`whitespace-nowrap px-6 py-3 rounded-full font-bold transition-all ${
                  isActive 
                    ? 'bg-[#FCD34D] text-[#78350F] shadow-[0_4px_0_0_#D97706] scale-105' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200'
                }`}
              >
                {category === 'all' ? 'All Toys 🌟' : category}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
            <p className="text-2xl font-bold text-slate-400 mb-4">No toys found!</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="text-indigo-600 font-bold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                onClick={() => navigate(`/shop/product/${product.id}`)}
                className="group bg-white rounded-[2rem] p-4 shadow-sm border-2 border-slate-100 hover:border-pink-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="bg-slate-50 rounded-2xl aspect-square mb-4 overflow-hidden relative">
                  <img 
                    src={product.image_url || `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`} 
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-slate-800 text-white font-bold px-4 py-2 rounded-full rotate-12 shadow-lg">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow flex flex-col justify-between px-2">
                  <div>
                    {product.parent_category && (
                      <p className="text-pink-500 font-bold text-xs uppercase tracking-wider mb-1">
                        {product.parent_category}
                      </p>
                    )}
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-black text-[#4F46E5]">
                      {formatPrice(product.price)}
                    </span>
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.stock <= 0}
                      className="bg-[#10B981] hover:bg-[#059669] text-white p-3 rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Button for Mobile (if items in cart) */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center md:hidden px-4">
          <button 
            onClick={() => navigate('/shop/cart')}
            className="w-full bg-[#1E1B4B] text-white py-4 rounded-full font-bold text-lg shadow-2xl flex items-center justify-center gap-3 animate-bounce"
          >
            <ShoppingBag /> View Cart ({cartCount}) - {formatPrice(cartTotal)}
          </button>
        </div>
      )}
    </div>
  );
};
