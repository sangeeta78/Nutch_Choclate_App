import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import { formatINR, formatDate } from '../utils/format.js';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/my')
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 font-serif text-3xl font-bold">My Orders</h1>
      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl">📦</div>
          <p className="mt-3 text-chocolate-light dark:text-cream/60">You have no orders yet.</p>
          <Link to="/products" className="btn-gold mt-4">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link
              key={o._id}
              to={`/orders/${o._id}`}
              className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">{o.orderId}</p>
                <p className="text-sm text-chocolate-light dark:text-cream/60">
                  Placed on {formatDate(o.createdAt)} · {o.items.length} item(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">{formatINR(o.grandTotal)}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[o.orderStatus]}`}>
                  {o.orderStatus}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
