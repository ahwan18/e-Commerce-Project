import { useEffect, useMemo, useState } from 'react';
import { Plus, QrCode, Power, Pencil, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/Button';
import { QRCodeDisplay } from '../../components/QRCodeDisplay';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { AdminModal } from '../../components/admin/AdminModal';
import * as CounterController from '../../controllers/counterController';

export const ManageCounters = () => {
  const [counters, setCounters] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCounter, setSelectedCounter] = useState(null);
  const [editingCounter, setEditingCounter] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState(null);

  const loadCounters = async () => {
    try {
      setLoading(true);
      const data = await CounterController.fetchCounters();
      setCounters(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCounters();
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await CounterController.addCounter(name);
      setName('');
      await loadCounters();
      setToast({ type: 'success', message: 'Counter berhasil dibuat' });
    } catch (err) {
      setError(err.message);
      setToast({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (counter) => {
    try {
      await CounterController.setCounterActive(counter.id, !counter.is_active);
      await loadCounters();
      setToast({
        type: 'success',
        message: `Counter ${counter.is_active ? 'dinonaktifkan' : 'diaktifkan'}`,
      });
    } catch (err) {
      setError(err.message);
      setToast({ type: 'error', message: err.message });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCounter) return;
    try {
      setSubmitting(true);
      await CounterController.editCounter(editingCounter.id, {
        name: editingCounter.name,
        is_active: editingCounter.is_active,
      });
      setEditingCounter(null);
      await loadCounters();
      setToast({ type: 'success', message: 'Counter berhasil diperbarui' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    try {
      setSubmitting(true);
      if (confirmAction.type === 'delete') {
        await CounterController.removeCounter(confirmAction.counter.id);
        setToast({ type: 'success', message: 'Counter berhasil dihapus' });
      } else if (confirmAction.type === 'force_end') {
        await CounterController.forceEndCounterSession(confirmAction.counter.id);
        setToast({ type: 'success', message: 'Sesi berhasil diakhiri' });
      }
      setConfirmAction(null);
      await loadCounters();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const activeSessions = useMemo(
    () => counters.filter((counter) => counter.is_locked),
    [counters]
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-md text-white ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}

      <section className="surface-card p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Counter Management</h3>
        <p className="text-slate-600">
          Buat, edit, hapus counter, monitor sesi aktif, dan generate QR.
        </p>
      </section>

      <section className="surface-card p-6">
        <h4 className="text-base font-semibold text-slate-900 mb-3">Tambah Counter</h4>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama counter (contoh: Counter 1)"
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
            required
            aria-label="Nama counter"
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            className="flex items-center gap-2"
            aria-label="Tambah counter baru"
          >
            <Plus size={18} />
            {submitting ? 'Menyimpan...' : 'Tambah Counter'}
          </Button>
        </form>
        {error && (
          <div className="mt-4 bg-red-50 text-red-800 border border-red-200 px-3 py-2 rounded-xl" role="alert">
            {error}
          </div>
        )}
      </section>

      <section className="surface-card p-6">
        <h4 className="text-base font-semibold text-slate-900 mb-3">Active Sessions</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Counter</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Session ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {activeSessions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-sm text-slate-500">
                    Tidak ada sesi aktif
                  </td>
                </tr>
              ) : (
                activeSessions.map((counter) => (
                  <tr key={counter.id}>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{counter.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 font-mono">
                      {counter.current_session_id || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge tone="warning">Active</StatusBadge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        onClick={() =>
                          setConfirmAction({ type: 'force_end', counter })
                        }
                        variant="danger"
                        size="sm"
                        className="flex items-center gap-2"
                        aria-label={`Force end session ${counter.name}`}
                      >
                        <ShieldAlert size={14} />
                        Force End
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="surface-card p-6">
        <h4 className="text-base font-semibold text-slate-900 mb-3">All Counters</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Session</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-slate-500">
                    Memuat counter...
                  </td>
                </tr>
              ) : counters.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-slate-500">
                    Belum ada counter
                  </td>
                </tr>
              ) : (
                counters.map((counter) => (
                  <tr key={counter.id}>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{counter.name}</td>
                    <td className="px-4 py-3">
                      {!counter.is_active ? (
                        <StatusBadge tone="neutral">Inactive</StatusBadge>
                      ) : counter.is_locked ? (
                        <StatusBadge tone="warning">In Use</StatusBadge>
                      ) : (
                        <StatusBadge tone="success">Active</StatusBadge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-600">
                      {counter.current_session_id || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCounter(counter)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                          title="Generate QR"
                          aria-label={`Generate QR ${counter.name}`}
                        >
                          <QrCode size={18} />
                        </button>
                        <button
                          onClick={() =>
                            setEditingCounter({
                              id: counter.id,
                              name: counter.name,
                              is_active: counter.is_active,
                            })
                          }
                          className="text-slate-600 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100"
                          title="Edit counter"
                          aria-label={`Edit ${counter.name}`}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => toggleActive(counter)}
                          className="text-amber-600 hover:text-amber-800 p-2 rounded-lg hover:bg-amber-50"
                          title="Toggle status aktif"
                          aria-label={`Toggle active ${counter.name}`}
                        >
                          <Power size={18} />
                        </button>
                        <button
                          onClick={() => setConfirmAction({ type: 'delete', counter })}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                          title="Delete counter"
                          aria-label={`Hapus ${counter.name}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {editingCounter && (
        <AdminModal title="Edit Counter" onClose={() => setEditingCounter(null)} maxWidth="max-w-md">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Nama Counter</label>
                <input
                  value={editingCounter.name}
                  onChange={(e) =>
                    setEditingCounter((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-xl"
                  aria-label="Edit nama counter"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 min-h-11">
                <input
                  type="checkbox"
                  checked={editingCounter.is_active}
                  onChange={(e) =>
                    setEditingCounter((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                />
                Counter aktif
              </label>
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveEdit}
                  variant="primary"
                  className="flex-1"
                  disabled={submitting}
                  aria-label="Simpan perubahan counter"
                >
                  Simpan
                </Button>
                <Button
                  onClick={() => setEditingCounter(null)}
                  variant="secondary"
                  className="flex-1"
                  aria-label="Batal edit counter"
                >
                  Batal
                </Button>
              </div>
            </div>
        </AdminModal>
      )}

      {confirmAction && (
        <AdminModal
          title={confirmAction.type === 'delete' ? 'Hapus Counter?' : 'Akhiri Sesi Aktif?'}
          onClose={() => setConfirmAction(null)}
          maxWidth="max-w-md"
        >
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Konfirmasi tindakan
            </h3>
            <p className="text-sm text-slate-600 mb-5">
              {confirmAction.type === 'delete'
                ? `Counter ${confirmAction.counter.name} akan dihapus permanen.`
                : `Sesi pada ${confirmAction.counter.name} akan diakhiri paksa.`}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleConfirm}
                variant="danger"
                className="flex-1"
                disabled={submitting}
              >
                Konfirmasi
              </Button>
              <Button
                onClick={() => setConfirmAction(null)}
                variant="secondary"
                className="flex-1"
              >
                Batal
              </Button>
            </div>
        </AdminModal>
      )}

      {selectedCounter && (
        <AdminModal
          title={`QR Counter: ${selectedCounter.name}`}
          onClose={() => setSelectedCounter(null)}
          maxWidth="max-w-md"
        >
            <QRCodeDisplay
              value={`${window.location.origin}/menu?counter_id=${selectedCounter.id}`}
              label={`Scan untuk buka menu ${selectedCounter.name}`}
              fileName={`counter-${selectedCounter.name.replace(/\s+/g, '-').toLowerCase()}.png`}
            />
        </AdminModal>
      )}
    </div>
  );
};
