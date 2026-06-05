import { ArrowRight, Star, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <header className="relative bg-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Spark Imagination with Every Play
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-10">
              Discover a world of premium toys, from educational classics to the latest trends. Carefully curated for all ages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/catalog" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-white text-indigo-900 hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Shop Collection
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-indigo-800 text-white hover:bg-indigo-700 transition-colors border border-indigo-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Premium Quality</h3>
              <p className="text-slate-600">Sourced from the best brands to ensure safety and durability.</p>
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Easy Shopping</h3>
              <p className="text-slate-600">Seamless online experience with fast and secure checkout.</p>
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Secure Payments</h3>
              <p className="text-slate-600">Your transactions are protected with industry-leading security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50 flex-grow">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to find the perfect gift?</h2>
          <p className="text-lg text-slate-600 mb-8">
            Browse our catalog and create an account to start your journey.
          </p>
          <Link 
            to="/catalog" 
            className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md"
          >
            Browse Catalog
          </Link>
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center">
        <p>© 2026 Toy Store. All rights reserved.</p>
      </footer>
    </div>
  );
};
