import { Monitor, Smartphone } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Settings = () => {
  const { uiMode, updateUiMode, isLoading } = useSettings();

  if (isLoading) {
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Store Settings</h2>
        <p className="text-slate-600">Configure global application behavior and features.</p>
      </div>

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
    </div>
  );
};
