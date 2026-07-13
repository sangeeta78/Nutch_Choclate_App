import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';
import { formatINR, formatDate } from '../../utils/format.js';

const STATUSES = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const load = (status = filter) => {
    setLoading(true);
    api
      .get('/admin/orders', { params: { status } })
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); /* eslint-disable-next-line */ }, [filter]);

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      toast.success(`Order marked as ${status}`);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h2 className="mb-6 font-serif text-2xl font-bold">Order Management</h2>

      {/* Status filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === s
                ? 'bg-chocolate text-cream dark:bg-gold dark:text-chocolate-dark'
                : 'bg-white text-chocolate dark:bg-chocolate dark:text-cream'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <p className="py-12 text-center text-chocolate-light dark:text-cream/60">No orders found.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-chocolate/10 dark:border-cream/10">
              <tr className="text-chocolate-light dark:text-cream/60">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-chocolate/5 dark:border-cream/5">
                  <td className="p-4 font-medium">{o.orderId}</td>
                  <td className="p-4">
                    <div>{o.user?.name || o.shipping.name}</div>
                    <div className="text-xs text-chocolate-light dark:text-cream/50">{o.shipping.email}</div>
                  </td>
                  <td className="p-4">{formatDate(o.createdAt)}</td>
                  <td className="p-4">{formatINR(o.grandTotal)}</td>
                  <td className="p-4">
                    <span className={o.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => changeStatus(o._id, e.target.value)}
                      className="input !py-1.5 !text-sm"
                    >
                      {STATUSES.filter((s) => s !== 'All').map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
