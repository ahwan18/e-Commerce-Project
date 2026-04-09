import { X } from 'lucide-react';

const PARENT_CATEGORIES = [
  'Mainan Klasik & Tradisional',
  'Mainan Kreativitas & Seni',
  'Mainan Fisik & Ketangkasan',
  'Mainan Edukasi & Sains',
  'Mainan Koleksi & Aksesori',
];

const PRICE_RANGES = [
  { label: '1rb–3rb', min: 1000, max: 3000 },
  { label: '4rb–7rb', min: 4000, max: 7000 },
  { label: '8rb–10rb', min: 8000, max: 10000 },
];

const MATERIALS = ['Plastik', 'Kertas', 'Karet', 'Kayu'];
const GENDER_THEMES = ['Laki-laki', 'Perempuan', 'Unisex'];
const MOVEMENT_TYPES = ['Manual', 'Pullback', 'Pegas', 'Air'];
const SIZES = ['Saku', 'Kecil', 'Sedang'];

export const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const handleCategoryChange = (category) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? '' : category,
    });
  };

  const handleMultiSelectChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFilterChange({
      ...filters,
      [filterType]: newValues,
    });
  };

  const handlePriceRangeChange = (range) => {
    const currentRanges = filters.priceRange || [];
    const rangeLabel = range.label;
    const newRanges = currentRanges.includes(rangeLabel)
      ? currentRanges.filter(r => r !== rangeLabel)
      : [...currentRanges, rangeLabel];

    onFilterChange({
      ...filters,
      priceRange: newRanges,
    });
  };

  const hasActiveFilters =
    filters.category ||
    (filters.priceRange && filters.priceRange.length > 0) ||
    (filters.material && filters.material.length > 0) ||
    (filters.gender_theme && filters.gender_theme.length > 0) ||
    (filters.movement_type && filters.movement_type.length > 0) ||
    (filters.size && filters.size.length > 0);

  return (
    <aside className="surface-card p-5 sm:p-6 mb-4 sm:mb-6" aria-label="Panel filter produk">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Filter</h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-blue-700 hover:text-blue-800 font-semibold underline transition-colors min-h-11"
            aria-label="Reset semua filter"
          >
            Reset Semua
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Kategori */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Kategori Utama</h3>
          <div className="space-y-2">
            {PARENT_CATEGORIES.map((category) => (
              <label key={category} className="flex items-center cursor-pointer min-h-11">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                  aria-label={`Filter kategori ${category}`}
                />
                <span className="ml-3 text-slate-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Harga */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Harga</h3>
          <div className="space-y-2">
            {PRICE_RANGES.map((range) => (
              <label key={range.label} className="flex items-center cursor-pointer min-h-11">
                <input
                  type="checkbox"
                  checked={(filters.priceRange || []).includes(range.label)}
                  onChange={() => handlePriceRangeChange(range)}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                  aria-label={`Filter harga ${range.label}`}
                />
                <span className="ml-3 text-slate-700">Rp {range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Material */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Bahan</h3>
          <div className="space-y-2">
            {MATERIALS.map((material) => (
              <label key={material} className="flex items-center cursor-pointer min-h-11">
                <input
                  type="checkbox"
                  checked={(filters.material || []).includes(material)}
                  onChange={() => handleMultiSelectChange('material', material)}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                  aria-label={`Filter bahan ${material}`}
                />
                <span className="ml-3 text-slate-700 capitalize">{material}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tema Gender */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Tema</h3>
          <div className="space-y-2">
            {GENDER_THEMES.map((theme) => (
              <label key={theme} className="flex items-center cursor-pointer min-h-11">
                <input
                  type="checkbox"
                  checked={(filters.gender_theme || []).includes(theme)}
                  onChange={() => handleMultiSelectChange('gender_theme', theme)}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                  aria-label={`Filter tema ${theme}`}
                />
                <span className="ml-3 text-slate-700 capitalize">{theme}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Jenis Gerakan */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Jenis Gerakan</h3>
          <div className="space-y-2">
            {MOVEMENT_TYPES.map((type) => (
              <label key={type} className="flex items-center cursor-pointer min-h-11">
                <input
                  type="checkbox"
                  checked={(filters.movement_type || []).includes(type)}
                  onChange={() => handleMultiSelectChange('movement_type', type)}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                  aria-label={`Filter jenis gerakan ${type}`}
                />
                <span className="ml-3 text-slate-700 capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ukuran */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Ukuran</h3>
          <div className="space-y-2">
            {SIZES.map((size) => (
              <label key={size} className="flex items-center cursor-pointer min-h-11">
                <input
                  type="checkbox"
                  checked={(filters.size || []).includes(size)}
                  onChange={() => handleMultiSelectChange('size', size)}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                  aria-label={`Filter ukuran ${size}`}
                />
                <span className="ml-3 text-slate-700 capitalize">{size}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
