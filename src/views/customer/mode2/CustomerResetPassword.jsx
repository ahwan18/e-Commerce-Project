import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const CustomerResetPassword = () => {
  const { updateAccount, signOut } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password baru minimal 6 karakter.' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi password tidak sama.' });
      return;
    }

    try {
      setLoading(true);
      const result = await updateAccount({ password });
      if (!result.success) {
        setMessage({ type: 'error', text: result.error || 'Gagal menyimpan password baru.' });
        return;
      }

      setMessage({ type: 'success', text: 'Password berhasil diperbarui. Kamu bisa login dengan password baru.' });
      setPassword('');
      setConfirmPassword('');
      await signOut();
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = async () => {
    setLoading(true);
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#FDF8F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[2rem] border-2 border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <KeyRound size={28} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Buat Password Baru</h1>
          <p className="mt-2 font-medium text-slate-500">
            Masukkan password baru untuk akun customer kamu.
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
            <label htmlFor="new-password" className="mb-2 block text-sm font-bold text-slate-700">
              Password Baru
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-3 font-medium outline-none transition-colors focus:border-indigo-500"
              placeholder="Minimal 6 karakter"
              required
            />
          </div>

          <div>
            <label htmlFor="confirm-new-password" className="mb-2 block text-sm font-bold text-slate-700">
              Konfirmasi Password
            </label>
            <input
              id="confirm-new-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-3 font-medium outline-none transition-colors focus:border-indigo-500"
              placeholder="Ulangi password baru"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-[#4F46E5] py-3.5 font-bold text-white shadow-[0_4px_0_0_#3730A3] transition-all hover:translate-y-1 hover:bg-[#4338CA] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          Sudah ingat password?{' '}
          <button
            type="button"
            onClick={handleBackToLogin}
            className="font-bold text-indigo-600 hover:text-indigo-800"
          >
            Login
          </button>
        </p>
      </div>
    </main>
  );
};
