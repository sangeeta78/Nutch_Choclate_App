import { useEffect, useState } from 'react';
import { FaShoppingBag, FaUsers, FaRupeeSign, FaBoxes } from 'react-icons/fa';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';
import { formatINR } from '../../utils/format.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/stats')
      .then(({ data }) => setStats(data.stats))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!stats) return null;

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: FaShoppingBag, color: 'bg-blue-500' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: FaUsers, color: 'bg-purple-500' },
    { label: 'Total Revenue', value: formatINR(stats.totalRevenue), icon: FaRupeeSign, color: 'bg-green-500' },
    { label: 'Products in Stock', value: stats.productsInStock, icon: FaBoxes, color: 'bg-gold' },
  ];

  return (
    <div>
      <h2 className="mb-6 font-serif text-2xl font-bold">Dashboard</h2>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card flex items-center gap-4 p-5">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-white ${c.color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm text-chocolate-light dark:text-cream/60">{c.label}</p>
                <p className="text-2xl font-bold">{c.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders by status */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 font-semibold">Orders by Status</h3>
          <div className="space-y-3">
            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
              <div key={s} className="flex items-center justify-between">
                <span>{s}</span>
                <span className="rounded-full bg-cream px-3 py-1 text-sm font-semibold dark:bg-chocolate-dark">
                  {stats.ordersByStatus?.[s] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock alert */}
        <div className="card p-6">
          <h3 className="mb-4 font-semibold">⚠️ Low Stock (≤ 5)</h3>
          {stats.lowStock?.length ? (
            <ul className="space-y-2">
              {stats.lowStock.map((p) => (
                <li key={p._id} className="flex justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="font-semibold text-red-500">{p.stock} left</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-chocolate-light dark:text-cream/60">All products well stocked 👍</p>
          )}
        </div>
      </div>
    </div>
  );
}
