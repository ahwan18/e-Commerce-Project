import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { validateEmail } from '../../../utils/helpers';

export const CustomerForgotPassword = () => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!validateEmail(normalizedEmail)) {
      setMessage({ type: 'error', text: 'Masukkan email yang valid.' });
      return;
    }

    try {
      setLoading(true);
      const result = await requestPasswordReset(normalizedEmail);
      setMessage({
        type: result.success ? 'success' : 'error',
        text: result.success
          ? 'Link reset password sudah dikirim. Silakan cek inbox atau spam email kamu.'
          : result.error || 'Gagal mengirim link reset password.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDF8F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[2rem] border-2 border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600">
          <ArrowLeft size={16} />
          Kembali ke Login
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <Mail size={28} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Lupa Password?</h1>
          <p className="mt-2 font-medium text-slate-500">
            Masukkan email akun customer. Kami akan mengirim link untuk membuat password baru.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm font-semibold ${
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="reset-email" className="mb-2 block text-sm font-bold text-slate-700">
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-3 font-medium outline-none transition-colors focus:border-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-[#4F46E5] py-3.5 font-bold text-white shadow-[0_4px_0_0_#3730A3] transition-all hover:translate-y-1 hover:bg-[#4338CA] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Mengirim...' : 'Kirim Link Reset Password'}
          </button>
        </form>
      </div>
    </main>
  );
};
