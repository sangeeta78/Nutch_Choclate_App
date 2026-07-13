import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';
import { formatINR } from '../../utils/format.js';

const CATEGORIES = ['Homemade Chocolates', 'Dry Fruits', 'Nuts', 'Gift Boxes'];

const EMPTY = {
  name: '', category: CATEGORIES[0], description: '', ingredients: '',
  weight: '', shelfLife: '', price: '', discount: 0, stock: 0,
  featured: false, images: '',
};

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // product id or null
  const [form, setForm] = useState(EMPTY);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/products', { params: { limit: 100 } })
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setFiles([]);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name, category: p.category, description: p.description,
      ingredients: p.ingredients, weight: p.weight, shelfLife: p.shelfLife,
      price: p.price, discount: p.discount, stock: p.stock,
      featured: p.featured, images: (p.images || []).join(', '),
    });
    setFiles([]);
    setModalOpen(true);
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Send as multipart so uploaded files ride along with the fields
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'images') {
          // Comma-separated image URLs -> individual entries
          v.split(',').map((s) => s.trim()).filter(Boolean).forEach((url) => fd.append('images', url));
        } else {
          fd.append(k, v);
        }
      });
      files.forEach((f) => fd.append('images', f));

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (editing) {
        await api.put(`/products/${editing}`, fd, config);
        toast.success('Product updated');
      } else {
        await api.post('/products', fd, config);
        toast.success('Product created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold">Product Management</h2>
        <button onClick={openAdd} className="btn-gold"><FaPlus /> Add Product</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-chocolate/10 dark:border-cream/10">
            <tr className="text-chocolate-light dark:text-cream/60">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-chocolate/5 dark:border-cream/5">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">{formatINR(p.price)}</td>
                <td className="p-4">{p.discount}%</td>
                <td className="p-4">
                  <span className={p.stock <= 5 ? 'font-semibold text-red-500' : ''}>{p.stock}</span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200">
                      <FaEdit />
                    </button>
                    <button onClick={() => remove(p._id)} className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editing ? 'Edit' : 'Add'} Product</h3>
              <button onClick={() => setModalOpen(false)} className="text-xl hover:text-gold"><FaTimes /></button>
            </div>
            <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Product Name</label>
                <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
              </div>
              <div>
                <label className="label">Category</label>
                <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Weight</label>
                <input className="input" value={form.weight} onChange={(e) => set('weight', e.target.value)} placeholder="250g" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Description</label>
                <textarea rows={2} className="input" value={form.description} onChange={(e) => set('description', e.target.value)} required />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Ingredients</label>
                <input className="input" value={form.ingredients} onChange={(e) => set('ingredients', e.target.value)} />
              </div>
              <div>
                <label className="label">Shelf Life</label>
                <input className="input" value={form.shelfLife} onChange={(e) => set('shelfLife', e.target.value)} placeholder="3 months" />
              </div>
              <div>
                <label className="label">Price (₹)</label>
                <input type="number" className="input" value={form.price} onChange={(e) => set('price', e.target.value)} required />
              </div>
              <div>
                <label className="label">Discount (%)</label>
                <input type="number" className="input" value={form.discount} onChange={(e) => set('discount', e.target.value)} />
              </div>
              <div>
                <label className="label">Stock</label>
                <input type="number" className="input" value={form.stock} onChange={(e) => set('stock', e.target.value)} required />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Image URLs (comma-separated)</label>
                <input className="input" value={form.images} onChange={(e) => set('images', e.target.value)} placeholder="https://..." />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Or Upload Images</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setFiles([...e.target.files])} className="input" />
              </div>
              <label className="flex items-center gap-2 sm:col-span-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
                <span>Featured product (show on home page)</span>
              </label>
              <div className="sm:col-span-2">
                <button type="submit" disabled={saving} className="btn-gold w-full">
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
