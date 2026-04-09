/**
 * ManageCategories View (Admin)
 *
 * Category management page for CRUD operations.
 *
 * NO business logic should be in this component - only UI.
 * All logic is handled through controllers.
 */

import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { AdminModal } from '../../components/admin/AdminModal';
import * as ProductController from '../../controllers/productController';

export const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await ProductController.fetchCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setShowModal(true);
    setError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      if (editingCategory) {
        await ProductController.editCategory(editingCategory.id, formData);
      } else {
        await ProductController.addCategory(formData);
      }

      await loadCategories();
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      return;
    }

    try {
      await ProductController.removeCategory(categoryId);
      await loadCategories();
    } catch (err) {
      alert('Gagal menghapus kategori: ' + err.message);
    }
  };

  if (loading) {
    return <Loading message="Memuat kategori..." />;
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-1">Kelola Kategori</h2>
            <p className="text-slate-600">Tambah, edit, atau hapus kategori</p>
          </div>
          <Button
            onClick={() => openModal()}
            variant="primary"
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Tambah Kategori
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="surface-card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {category.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(category)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600">
                {category.description || 'Tidak ada deskripsi'}
              </p>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">Belum ada kategori</p>
          </div>
        )}

      {showModal && (
        <AdminModal
          title={editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          onClose={closeModal}
          maxWidth="max-w-md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button
                  type="button"
                  onClick={closeModal}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                >
                  Batal
                </Button>
              </div>
            </form>
        </AdminModal>
      )}
    </div>
  );
};
