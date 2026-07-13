import { useEffect, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';
import { formatINR, formatDate } from '../../utils/format.js';

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null); // customer being viewed
  const [orders, setOrders] = useState([]);

  const load = (q = '') => {
    setLoading(true);
    api
      .get('/admin/customers', { params: { search: q } })
      .then(({ data }) => setCustomers(data.customers))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const viewOrders = async (customer) => {
    setSelected(customer);
    const { data } = await api.get(`/admin/customers/${customer._id}/orders`);
    setOrders(data.orders);
  };

  return (
    <div>
      <h2 className="mb-6 font-serif text-2xl font-bold">Customer Management</h2>

      {/* Search */}
      <form
        onSubmit={(e) => { e.preventDefault(); load(search); }}
        className="mb-6 flex max-w-md gap-2"
      >
        <div className="relative flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="input pr-10"
          />
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate-light" />
        </div>
        <button type="submit" className="btn-gold !px-4">Search</button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-chocolate/10 dark:border-cream/10">
              <tr className="text-chocolate-light dark:text-cream/60">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b border-chocolate/5 dark:border-cream/5">
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4">{c.mobile || '—'}</td>
                  <td className="p-4">{formatDate(c.createdAt)}</td>
                  <td className="p-4">
                    <button onClick={() => viewOrders(c)} className="text-gold hover:underline">
                      View Orders
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer order history drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card max-h-[85vh] w-full max-w-2xl overflow-y-auto p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{selected.name}</h3>
                <p className="text-sm text-chocolate-light dark:text-cream/60">{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-xl hover:text-gold"><FaTimes /></button>
            </div>
            {orders.length === 0 ? (
              <p className="text-chocolate-light dark:text-cream/60">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o._id} className="flex items-center justify-between rounded-xl bg-cream p-4 dark:bg-chocolate-dark">
                    <div>
                      <p className="font-medium">{o.orderId}</p>
                      <p className="text-xs text-chocolate-light dark:text-cream/50">{formatDate(o.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatINR(o.grandTotal)}</p>
                      <p className="text-xs">{o.orderStatus}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
