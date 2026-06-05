import { useState, useEffect } from 'react';
import { ArrowRight, Star, Sparkles, Rocket, Heart, Shield, Zap, Mail, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-[#FDF8F5] flex flex-col font-sans selection:bg-pink-300 selection:text-pink-900 overflow-x-hidden">
      
      {/* Playful Hero Section */}
      <header className="relative bg-[#4F46E5] text-white overflow-hidden rounded-b-[3rem] sm:rounded-b-[5rem] shadow-2xl z-10 mb-16">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#EC4899] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-[#10B981] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] right-[20%] w-80 h-80 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10 text-center">
          <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6 border border-white/30 text-white font-medium shadow-sm">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
            <span className="tracking-wide">Welcome to the Ultimate Toy Universe!</span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6 drop-shadow-lg leading-tight">
            Play.<br className="md:hidden" /> Discover.<br className="md:hidden" /> <span className="text-yellow-300">Grow.</span>
          </h1>
          <p className="text-lg sm:text-2xl text-indigo-100 mb-10 max-w-2xl mx-auto font-medium leading-relaxed px-4">
            Find the perfect toys that spark joy and imagination for every age. Let the adventure begin!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/catalog" 
              className="group inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-extrabold rounded-full bg-[#FCD34D] text-[#78350F] hover:bg-[#FBBF24] hover:scale-105 hover:-translate-y-1 transition-all shadow-[0_8px_0_0_#D97706] hover:shadow-[0_4px_0_0_#D97706] active:translate-y-2 active:shadow-none"
            >
              Shop Toys Now
              <Rocket className="ml-3 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full">
        
        {/* Magic Formula (Why Choose Us) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-[#1E1B4B] mb-4 drop-shadow-sm">Our Magic Formula ✨</h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">We don't just sell toys; we deliver experiences that help children learn, laugh, and dream bigger.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-[2rem] p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-pink-100 hover:-translate-y-2 transition-transform">
              <div className="w-20 h-20 bg-pink-100 text-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <Heart className="w-10 h-10 fill-current" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-3">Made with Love</h3>
              <p className="text-slate-600 font-medium">Every toy is carefully curated to ensure it brings maximum joy and creativity to your child's playtime.</p>
            </div>
            
            <div className="bg-white rounded-[2rem] p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-emerald-100 hover:-translate-y-2 transition-transform">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 -rotate-3">
                <Shield className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-3">100% Safe</h3>
              <p className="text-slate-600 font-medium">We strictly adhere to global safety standards. Non-toxic materials and zero sharp edges—guaranteed.</p>
            </div>
            
            <div className="bg-white rounded-[2rem] p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-yellow-100 hover:-translate-y-2 transition-transform">
              <div className="w-20 h-20 bg-yellow-100 text-yellow-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-6">
                <Zap className="w-10 h-10 fill-current" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-800 mb-3">Lightning Fast</h3>
              <p className="text-slate-600 font-medium">Kids can't wait, and neither should you! We pack and ship orders the same day they are placed.</p>
            </div>
          </div>
        </section>

        {/* Dynamic Categories Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
            <h2 className="text-4xl sm:text-5xl font-black text-[#1E1B4B] drop-shadow-sm text-center sm:text-left">
              Explore by Category 🧩
            </h2>
            <Link to="/catalog" className="flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition-colors bg-indigo-50 px-6 py-3 rounded-full hover:bg-indigo-100">
              See All Toys <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {categories.slice(0, 8).map((cat, index) => {
                const colors = [
                  'bg-pink-100 text-pink-700 border-pink-300 shadow-pink-200',
                  'bg-cyan-100 text-cyan-700 border-cyan-300 shadow-cyan-200',
                  'bg-yellow-100 text-yellow-700 border-yellow-300 shadow-yellow-200',
                  'bg-emerald-100 text-emerald-700 border-emerald-300 shadow-emerald-200',
                  'bg-purple-100 text-purple-700 border-purple-300 shadow-purple-200',
                  'bg-orange-100 text-orange-700 border-orange-300 shadow-orange-200',
                ];
                const colorClass = colors[index % colors.length];
                
                return (
                  <Link 
                    key={cat.id} 
                    to={`/catalog?category=${cat.id}`}
                    className={`group p-6 rounded-3xl border-2 shadow-lg transition-all hover:scale-105 hover:-translate-y-2 flex flex-col items-center justify-center text-center h-40 ${colorClass}`}
                  >
                    <h3 className="text-xl sm:text-2xl font-black group-hover:scale-110 transition-transform">{cat.name}</h3>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Featured Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-[#1E1B4B] drop-shadow-sm flex items-center justify-center">
              New Arrivals <Star className="ml-3 w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
            </h2>
            <p className="text-xl text-slate-500 font-medium mt-4">Fresh out of the toy box!</p>
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
                      <div className="bg-indigo-50 p-2.5 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
             <Link to="/catalog" className="inline-flex items-center text-lg font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-4 decoration-2">
                Discover 100+ more toys
             </Link>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="bg-gradient-to-br from-indigo-50 to-[#FDF8F5] py-24 border-y-2 border-indigo-100 mb-24">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-black text-[#1E1B4B] mb-4">Happy Kids, Happy Parents 😊</h2>
                <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Don't just take our word for it. Hear from our incredible community of toy lovers.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: "Sarah M.", role: "Mom of 2", text: "The quality of the wooden blocks we bought is unbelievable. My kids play with them literally every single day!" },
                  { name: "David K.", role: "Cool Uncle", text: "I'm officially the favorite uncle thanks to this store. The shipping was insanely fast and the packaging was super cute." },
                  { name: "Elena P.", role: "Teacher", text: "As a preschool teacher, I appreciate the educational selection here. The toys are safe, engaging, and reasonably priced." }
                ].map((testimonial, i) => (
                   <div key={i} className="bg-white rounded-3xl p-8 relative shadow-lg">
                      <Quote className="absolute top-6 right-6 w-12 h-12 text-indigo-100 rotate-180" />
                      <div className="flex items-center gap-2 mb-4">
                         {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                      </div>
                      <p className="text-slate-700 text-lg font-medium mb-6 relative z-10">"{testimonial.text}"</p>
                      <div>
                         <p className="font-bold text-slate-900">{testimonial.name}</p>
                         <p className="text-sm text-slate-500 font-medium">{testimonial.role}</p>
                      </div>
                   </div>
                ))}
              </div>
           </div>
        </section>

        {/* Newsletter CTA */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
           <div className="bg-[#1E1B4B] rounded-[3rem] p-8 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
              <div className="absolute bottom-[-50%] right-[-10%] w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
              
              <div className="relative z-10">
                 <Mail className="w-16 h-16 mx-auto mb-6 text-pink-400" />
                 <h2 className="text-4xl md:text-5xl font-black mb-4">Join the Toy Club! 🎁</h2>
                 <p className="text-xl text-indigo-200 font-medium mb-8 max-w-xl mx-auto">Subscribe to our newsletter for exclusive discounts, early access to new toys, and fun playtime ideas.</p>
                 
                 <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <input 
                       type="email" 
                       placeholder="Enter your email" 
                       className="w-full px-6 py-4 rounded-full text-slate-900 font-bold outline-none focus:ring-4 focus:ring-pink-400"
                    />
                    <button className="bg-[#EC4899] hover:bg-[#DB2777] text-white font-extrabold px-8 py-4 rounded-full whitespace-nowrap transition-transform hover:scale-105 active:scale-95 shadow-[0_4px_0_0_#BE185D]">
                       Subscribe
                    </button>
                 </form>
              </div>
           </div>
        </section>

      </main>

      {/* Playful Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 mt-auto rounded-t-[3rem] sm:rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-6">Toko Mainan</h2>
          <p className="max-w-md mx-auto mb-8 font-medium text-slate-400">
            Bringing smiles and endless fun to kids everywhere. Your favorite toys are just a click away!
          </p>
          <div className="w-16 h-1 bg-slate-700 mx-auto rounded-full mb-8"></div>
          <div className="flex justify-center gap-6 mb-8">
             <Link to="/catalog" className="font-bold hover:text-white transition-colors">Catalog</Link>
             <Link to="/login" className="font-bold hover:text-white transition-colors">Account</Link>
             <a href="#" className="font-bold hover:text-white transition-colors">Privacy</a>
             <a href="#" className="font-bold hover:text-white transition-colors">Terms</a>
          </div>
          <p className="text-sm font-semibold text-slate-500">© {new Date().getFullYear()} Toko Mainan. Crafted with fun.</p>
        </div>
      </footer>
    </div>
  );
};
