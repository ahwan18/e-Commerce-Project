import { useState, useEffect } from 'react';
import { ArrowRight, Star, Sparkles, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../../components/Navbar';
import * as ProductController from '../../../controllers/productController';
import { formatPrice } from '../../../utils/helpers';

export const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          ProductController.fetchAllProducts(),
          ProductController.fetchCategories()
        ]);
        
        // Take a few random or top products for the "Featured" section
        setProducts(fetchedProducts.slice(0, 4));
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch landing page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF8F5] flex flex-col font-sans selection:bg-pink-300 selection:text-pink-900">
      <Navbar variant="fun" />

      {/* Playful Hero Section */}
      <header className="relative bg-[#4F46E5] text-white overflow-hidden rounded-b-[3rem] shadow-2xl z-10 mb-12">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#EC4899] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-[#10B981] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] right-[20%] w-80 h-80 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10 text-center">
          <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6 border border-white/30 text-white font-medium shadow-sm">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
            <span className="tracking-wide">Welcome to the Ultimate Toy Universe!</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 drop-shadow-lg leading-tight">
            Play.<br className="md:hidden" /> Discover.<br className="md:hidden" /> <span className="text-yellow-300">Grow.</span>
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Find the perfect toys that spark joy and imagination for every age. Let the adventure begin!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/catalog" 
              className="group inline-flex items-center justify-center px-10 py-5 text-xl font-extrabold rounded-full bg-[#FCD34D] text-[#78350F] hover:bg-[#FBBF24] hover:scale-105 hover:-translate-y-1 transition-all shadow-[0_8px_0_0_#D97706] hover:shadow-[0_4px_0_0_#D97706] active:translate-y-2 active:shadow-none"
            >
              Shop Toys Now
              <Rocket className="ml-3 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Dynamic Categories Section */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-black text-[#1E1B4B] drop-shadow-sm">
              Explore by Category 🧩
            </h2>
            <Link to="/catalog" className="hidden sm:flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
              See All <ArrowRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((cat, index) => {
                // Assign playful colors based on index
                const colors = [
                  'bg-pink-100 text-pink-700 border-pink-300',
                  'bg-cyan-100 text-cyan-700 border-cyan-300',
                  'bg-yellow-100 text-yellow-700 border-yellow-300',
                  'bg-emerald-100 text-emerald-700 border-emerald-300',
                  'bg-purple-100 text-purple-700 border-purple-300',
                  'bg-orange-100 text-orange-700 border-orange-300',
                ];
                const colorClass = colors[index % colors.length];
                
                return (
                  <Link 
                    key={cat.id} 
                    to={`/catalog?category=${cat.id}`}
                    className={`group p-6 rounded-3xl border-2 transition-all hover:scale-105 hover:-translate-y-1 hover:shadow-xl flex flex-col items-center text-center ${colorClass}`}
                  >
                    <h3 className="text-xl font-bold mb-2 group-hover:scale-110 transition-transform">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-sm opacity-80 font-medium line-clamp-2">{cat.description}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Featured Products Section */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-black text-[#1E1B4B] drop-shadow-sm flex items-center">
              New Arrivals <Star className="ml-3 w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/shop/product/${product.id}`}
                  className="bg-white rounded-[2rem] p-4 shadow-sm border-2 border-slate-100 hover:border-indigo-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
                >
                  <div className="bg-slate-50 rounded-2xl aspect-square mb-4 overflow-hidden relative">
                    <img 
                      src={product.image_url || `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`} 
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Almost Gone!
                      </span>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col justify-between px-2">
                    <div>
                      {product.parent_category && (
                        <p className="text-indigo-500 font-bold text-xs uppercase tracking-wider mb-1">
                          {product.parent_category}
                        </p>
                      )}
                      <h3 className="font-extrabold text-slate-900 text-lg leading-tight mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-end justify-between mt-4">
                      <span className="text-2xl font-black text-[#4F46E5]">
                        {formatPrice(product.price)}
                      </span>
                      <div className="bg-indigo-50 p-2.5 rounded-full text-indigo-600">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Playful Footer */}
      <footer className="bg-[#1E1B4B] text-slate-300 py-16 mt-auto rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-6">Toko Mainan</h2>
          <p className="max-w-md mx-auto mb-8 font-medium text-indigo-200">
            Bringing smiles and endless fun to kids everywhere. Your favorite toys are just a click away!
          </p>
          <div className="w-16 h-1 bg-indigo-500 mx-auto rounded-full mb-8"></div>
          <p className="text-sm font-semibold">© {new Date().getFullYear()} Toko Mainan. Crafted with fun.</p>
        </div>
      </footer>
    </div>
  );
};
