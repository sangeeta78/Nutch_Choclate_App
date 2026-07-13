import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    address: user?.address?.address || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        mobile: form.mobile,
        address: {
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
      };
      if (form.password) payload.password = form.password;
      const { data } = await api.put('/users/profile', payload);
      updateUser(data.user);
      toast.success('Profile updated');
      setForm({ ...form, password: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 font-serif text-3xl font-bold">My Profile</h1>
      <form onSubmit={save} className="card space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <div>
            <label className="label">Email (read-only)</label>
            <input className="input opacity-60" value={user.email} disabled />
          </div>
          <Field label="Mobile" value={form.mobile} onChange={(v) => setForm({ ...form, mobile: v })} />
          <Field label="PIN Code" value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} />
        </div>
        <div>
          <label className="label">Address</label>
          <textarea
            rows={2}
            className="input"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          <Field label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
        </div>
        <div>
          <label className="label">New Password (leave blank to keep current)</label>
          <input
            type="password"
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-gold">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={logout} className="btn-outline">Logout</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
