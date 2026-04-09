import { AlertCircle } from 'lucide-react';
import { useCounter } from '../context/CounterContext';
import { Loading } from './Loading';

export const CounterGate = ({ children }) => {
  const { loading, error, hasActiveCounterSession, counterName } = useCounter();

  if (loading) {
    return <Loading message="Memvalidasi counter..." />;
  }

  if (!hasActiveCounterSession) {
    return (
      <div className="page-shell flex items-center justify-center p-4">
        <div className="max-w-md w-full surface-card p-6">
          <div className="flex items-center gap-3 text-red-700 mb-3">
            <AlertCircle size={22} />
            <h2 className="text-xl font-semibold">Counter Sedang Tidak Tersedia</h2>
          </div>
          <p className="text-slate-700">
            {error || 'Silakan scan ulang QR yang tersedia di counter.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <div className="bg-blue-50 border-b border-blue-100" role="status" aria-live="polite">
        <div className="container mx-auto px-4 py-2 text-sm text-blue-800 font-medium">
          Counter aktif: {counterName || 'Unknown Counter'}
        </div>
      </div> */}
      {children}
    </>
  );
};
