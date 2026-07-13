import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import api from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import { formatINR, formatDate } from '../utils/format.js';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${orderId}`)
      .then(({ data }) => setOrder(data.order))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <Loader />;
  if (!order) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="card animate-scale-in p-8 text-center">
        {/* Success animation */}
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <FaCheckCircle className="animate-scale-in text-6xl text-green-500" />
        </div>
        <h1 className="font-serif text-3xl font-bold">Payment Successful!</h1>
        <p className="mt-2 text-chocolate-light dark:text-cream/60">
          Thank you for your order. A confirmation email has been sent (mock).
        </p>

        <dl className="mt-8 divide-y divide-chocolate/10 rounded-xl bg-cream p-5 text-left dark:divide-cream/10 dark:bg-chocolate-dark">
          <Row label="Order ID" value={order.orderId} />
          <Row label="Transaction ID" value={order.transactionId || state?.transactionId} />
          <Row label="Payment Method" value={order.paymentMethod || state?.method} />
          <Row
            label="Payment Status"
            value={<span className="font-semibold text-green-600 dark:text-green-400">{order.paymentStatus}</span>}
          />
          <Row label="Amount Paid" value={formatINR(order.grandTotal)} />
          <Row label="Estimated Delivery" value={formatDate(order.estimatedDelivery)} />
        </dl>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to={`/orders/${order._id}`} className="btn-outline">View Order Details</Link>
          <Link to="/products" className="btn-gold">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-3">
      <dt className="text-chocolate-light dark:text-cream/60">{label}</dt>
      <dd className="font-medium">{value || '—'}</dd>
    </div>
  );
}
