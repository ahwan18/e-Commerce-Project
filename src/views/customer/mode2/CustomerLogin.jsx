import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, loading: authLoading, signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getSafeCustomerRedirect = () => {
    const from = location.state?.from?.pathname;
    return from && !from.startsWith('/admin') ? from : '/catalog';
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(getSafeCustomerRedirect(), { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { success, error: signInError } = await signIn(email, password);

      if (success) {
        sessionStorage.setItem('auth_login_surface', 'customer');
        navigate(getSafeCustomerRedirect(), { replace: true });
      } else {
        setError(signInError || 'Failed to login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    sessionStorage.setItem('auth_login_surface', 'customer');
    const { success, error, url } = await signInWithGoogle();
    if (success && url) {
      window.location.replace(url);
      return;
    }
    if (!success) setError(error || 'Failed to connect to Google');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F5] p-4">
      <div className="bg-white p-8 w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] border-2 border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">👋</div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 font-medium">Please login to continue shopping.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center border border-red-100 font-medium">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow flex justify-center items-center gap-3 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            <path d="M1 1h22v22H1z" fill="none"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-400 font-bold">OR</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-indigo-500 transition-colors outline-none font-medium" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-bold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-xs font-black text-indigo-600 hover:text-indigo-800">
                Forgot password?
              </Link>
            </div>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-indigo-500 transition-colors outline-none font-medium" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_0_0_#3730A3] hover:shadow-none hover:translate-y-1 mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <Link
          to="/"
          className="mt-4 flex w-full items-center justify-center rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 px-4 py-3.5 text-center text-sm font-black text-amber-800 transition-all hover:border-amber-400 hover:bg-amber-100"
        >
          Lanjut sebagai Guest - lihat-lihat dulu, checkout perlu login
        </Link>
        
        <div className="mt-8 text-center text-sm text-slate-500 font-medium">
          <p>Don't have an account? <Link to="/register" state={{ from: location.state?.from }} className="text-indigo-600 hover:text-indigo-800 font-bold ml-1">Create one</Link></p>
        </div>
      </div>
    </div>
  );
};
