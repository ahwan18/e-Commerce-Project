import { X } from 'lucide-react';

const LABEL_MAP = {
  'Laki-laki': 'Laki-laki',
  'Perempuan': 'Perempuan',
  'Unisex': 'Unisex',
  'Manual': 'Manual',
  'Pullback': 'Pullback',
  'Pegas': 'Pegas',
  'Air': 'Air',
  'Saku': 'Saku',
  'Kecil': 'Kecil',
  'Sedang': 'Sedang',
  'Plastik': 'Plastik',
  'Kertas': 'Kertas',
  'Karet': 'Karet',
  'Kayu': 'Kayu',
};

export const ActiveFilters = ({ filters, onRemoveFilter }) => {
  const chips = [];

  if (filters.category) {
    chips.push({
      id: `category-${filters.category}`,
      label: filters.category,
      type: 'category',
      value: filters.category,
    });
  }

  if (filters.priceRange && filters.priceRange.length > 0) {
    filters.priceRange.forEach((range) => {
      chips.push({
        id: `price-${range}`,
        label: `Rp ${range}`,
        type: 'priceRange',
        value: range,
      });
    });
  }

  if (filters.material && filters.material.length > 0) {
    filters.material.forEach((material) => {
      chips.push({
        id: `material-${material}`,
        label: LABEL_MAP[material] || material,
        type: 'material',
        value: material,
      });
    });
  }

  if (filters.gender_theme && filters.gender_theme.length > 0) {
    filters.gender_theme.forEach((theme) => {
      chips.push({
        id: `gender-${theme}`,
        label: LABEL_MAP[theme] || theme,
        type: 'gender_theme',
        value: theme,
      });
    });
  }

  if (filters.movement_type && filters.movement_type.length > 0) {
    filters.movement_type.forEach((type) => {
      chips.push({
        id: `movement-${type}`,
        label: LABEL_MAP[type] || type,
        type: 'movement_type',
        value: type,
      });
    });
  }

  if (filters.size && filters.size.length > 0) {
    filters.size.forEach((size) => {
      chips.push({
        id: `size-${size}`,
        label: LABEL_MAP[size] || size,
        type: 'size',
        value: size,
      });
    });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200" role="status" aria-live="polite">
      <p className="text-sm text-slate-700 font-semibold mb-3">Filter yang dipilih:</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <div
            key={chip.id}
            className="flex items-center gap-2 bg-white border border-blue-200 rounded-full px-3 py-1.5 text-sm text-slate-700 shadow-sm"
          >
            <span>{chip.label}</span>
            <button
              onClick={() => onRemoveFilter(chip.type, chip.value)}
              className="text-slate-500 hover:text-red-600 transition-colors min-h-8 min-w-8 inline-flex items-center justify-center"
              aria-label={`Hapus filter ${chip.label}`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
