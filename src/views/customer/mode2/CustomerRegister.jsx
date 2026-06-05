import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const CustomerRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { success, error: signUpError } = await signUp(email, password);
      
      if (success) {
        const from = location.state?.from?.pathname || '/catalog';
        navigate(from, { replace: true });
      } else {
        setError(signUpError || 'Failed to register');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F5] p-4">
      <div className="bg-white p-8 w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] border-2 border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✨</div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Create Account</h2>
          <p className="text-slate-500 font-medium">Join us to start shopping.</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-pink-500 transition-colors outline-none font-medium" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-pink-500 transition-colors outline-none font-medium" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-0 focus:border-pink-500 transition-colors outline-none font-medium" 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#EC4899] hover:bg-[#DB2777] text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_0_0_#BE185D] hover:shadow-none hover:translate-y-1 mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Register'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-slate-500 font-medium">
          <p>Already have an account? <Link to="/login" state={{ from: location.state?.from }} className="text-pink-600 hover:text-pink-800 font-bold ml-1">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};
