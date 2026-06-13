export const ORDER_STATUSES = [
  {
    value: 'pending_payment',
    legacyValues: ['pending'],
    label: 'Menunggu Pembayaran',
    shortLabel: 'Menunggu Bayar',
    description: 'Pesanan dibuat dan menunggu pembayaran customer.',
    colorClass: 'bg-amber-100 text-amber-800 border-amber-200',
    iconClass: 'bg-amber-100 text-amber-600',
  },
  {
    value: 'paid',
    label: 'Dibayar',
    shortLabel: 'Dibayar',
    description: 'Pembayaran berhasil diterima.',
    colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconClass: 'bg-emerald-100 text-emerald-600',
  },
  {
    value: 'processing',
    label: 'Diproses',
    shortLabel: 'Diproses',
    description: 'Toko sedang menyiapkan pesanan.',
    colorClass: 'bg-sky-100 text-sky-800 border-sky-200',
    iconClass: 'bg-sky-100 text-sky-600',
  },
  {
    value: 'shipped',
    label: 'Dikirim',
    shortLabel: 'Dikirim',
    description: 'Pesanan sudah diserahkan ke kurir.',
    colorClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    iconClass: 'bg-indigo-100 text-indigo-600',
  },
  {
    value: 'completed',
    label: 'Selesai',
    shortLabel: 'Selesai',
    description: 'Pesanan sudah diterima atau transaksi selesai.',
    colorClass: 'bg-blue-100 text-blue-800 border-blue-200',
    iconClass: 'bg-blue-100 text-blue-600',
  },
  {
    value: 'cancelled',
    label: 'Dibatalkan',
    shortLabel: 'Dibatalkan',
    description: 'Pesanan dibatalkan atau pembayaran gagal/expired.',
    colorClass: 'bg-red-100 text-red-800 border-red-200',
    iconClass: 'bg-red-100 text-red-600',
  },
];

export const ORDER_STATUS_VALUES = ORDER_STATUSES.map((status) => status.value);

export const normalizeOrderStatus = (status) => {
  if (status === 'pending') return 'pending_payment';
  return status || 'pending_payment';
};

export const getOrderStatusMeta = (status) => {
  const normalizedStatus = normalizeOrderStatus(status);
  return (
    ORDER_STATUSES.find(
      (item) =>
        item.value === normalizedStatus ||
        item.legacyValues?.includes(status)
    ) || {
      value: normalizedStatus,
      label: status || 'Tidak Diketahui',
      shortLabel: status || 'Unknown',
      description: 'Status pesanan belum dikenali.',
      colorClass: 'bg-slate-100 text-slate-800 border-slate-200',
      iconClass: 'bg-slate-100 text-slate-600',
    }
  );
};

export const getOrderStatusIndex = (status) =>
  ORDER_STATUSES.findIndex((item) => item.value === normalizeOrderStatus(status));
