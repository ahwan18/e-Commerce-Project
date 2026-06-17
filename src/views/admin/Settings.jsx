import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, KeyRound, Mail, Monitor, Save, Smartphone } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../utils/helpers';

export const Settings = () => {
  const { uiMode, updateUiMode, isLoading } = useSettings();
  const { user, updateAccount } = useAuth();
  const [accountForm, setAccountForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountMessage, setAccountMessage] = useState(null);

  useEffect(() => {
    setAccountForm((current) => ({
      ...current,
      email: user?.email || '',
    }));
  }, [user?.email]);

  const handleAccountChange = (event) => {
    setAccountForm({
      ...accountForm,
      [event.target.name]: event.target.value,
    });
    setAccountMessage(null);
  };

  const handleAccountSubmit = async (event) => {
    event.preventDefault();
    setAccountMessage(null);

    const nextEmail = accountForm.email.trim().toLowerCase();
    const emailChanged = nextEmail && nextEmail !== user?.email?.toLowerCase();
    const passwordChanged = accountForm.password.length > 0;

    if (!emailChanged && !passwordChanged) {
      setAccountMessage({ type: 'error', text: 'Tidak ada perubahan akun yang disimpan.' });
      return;
    }

    if (emailChanged && !validateEmail(nextEmail)) {
      setAccountMessage({ type: 'error', text: 'Format email tidak valid.' });
      return;
    }

    if (passwordChanged && accountForm.password.length < 6) {
      setAccountMessage({ type: 'error', text: 'Password baru minimal 6 karakter.' });
      return;
    }

    if (passwordChanged && accountForm.password !== accountForm.confirmPassword) {
      setAccountMessage({ type: 'error', text: 'Konfirmasi password tidak sama.' });
      return;
    }

    try {
      setAccountLoading(true);
      const result = await updateAccount({
        email: emailChanged ? nextEmail : undefined,
        password: passwordChanged ? accountForm.password : undefined,
      });

      if (!result.success) {
        setAccountMessage({ type: 'error', text: result.error || 'Gagal memperbarui akun.' });
        return;
      }

      setAccountForm((current) => ({
        ...current,
        email: result.user?.email || nextEmail,
        password: '',
        confirmPassword: '',
      }));
      setAccountMessage({
        type: 'success',
        text: emailChanged
          ? 'Akun berhasil diperbarui. Jika Supabase meminta konfirmasi, cek inbox email baru.'
          : 'Password admin berhasil diperbarui.',
      });
    } finally {
      setAccountLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Store Settings</h2>
        <p className="text-slate-600">Configure global application behavior and features.</p>
      </div>

      <div className="space-y-6">
      <div className="surface-card p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b pb-2">Customer Experience Mode</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mode 1: Counter / QR */}
          <button
            onClick={() => updateUiMode('mode1')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              uiMode === 'mode1' 
                ? 'border-indigo-600 bg-indigo-50/50' 
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${uiMode === 'mode1' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                <Smartphone size={24} />
              </div>
              <h4 className={`font-semibold ${uiMode === 'mode1' ? 'text-indigo-900' : 'text-slate-900'}`}>
                Counter / QR Flow
              </h4>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Standard operation for physical stores. Customers scan QR codes at specific tables/counters. No login required to order.
            </p>
            {uiMode === 'mode1' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Active
              </span>
            )}
          </button>

          {/* Mode 2: Standard E-commerce */}
          <button
            onClick={() => updateUiMode('mode2')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              uiMode === 'mode2' 
                ? 'border-indigo-600 bg-indigo-50/50' 
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${uiMode === 'mode2' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                <Monitor size={24} />
              </div>
              <h4 className={`font-semibold ${uiMode === 'mode2' ? 'text-indigo-900' : 'text-slate-900'}`}>
                Standard E-commerce
              </h4>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Traditional online shopping experience. Features a landing page. Customers must create an account/login to checkout.
            </p>
            {uiMode === 'mode2' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Active
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="surface-card p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Admin Account</h3>
        <p className="text-sm text-slate-600 mb-5">
          Ubah email dan password akun admin yang sedang login.
        </p>

        {accountMessage && (
          <div
            className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${
              accountMessage.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
            role="alert"
          >
            {accountMessage.type === 'success' ? (
              <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            )}
            <span>{accountMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleAccountSubmit} className="space-y-5">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-bold text-slate-700 mb-2">
              Email Admin
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-email"
                name="email"
                type="email"
                value={accountForm.email}
                onChange={handleAccountChange}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-bold text-slate-700 mb-2">
                Password Baru
              </label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  value={accountForm.password}
                  onChange={handleAccountChange}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
                  placeholder="Kosongkan jika tidak diubah"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-confirm-password" className="block text-sm font-bold text-slate-700 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-confirm-password"
                  name="confirmPassword"
                  type="password"
                  value={accountForm.confirmPassword}
                  onChange={handleAccountChange}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
                  placeholder="Ulangi password baru"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={accountLoading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />
            {accountLoading ? 'Menyimpan...' : 'Simpan Akun Admin'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};
