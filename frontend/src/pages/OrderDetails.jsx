import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaPrint, FaTimesCircle } from 'react-icons/fa';
import api from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import { formatINR, formatDate } from '../utils/format.js';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const cancel = async () => {
    if (!confirm('Cancel this order?')) return;
    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success('Order cancelled');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;
  if (!order) return null;

  const canCancel = !['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Invoice card - print-friendly */}
      <div className="card p-6 print:shadow-none" id="invoice">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-chocolate/10 pb-4 dark:border-cream/10">
          <div>
            <h1 className="font-serif text-2xl font-bold text-chocolate dark:text-gold">🍫 CocoaCraft</h1>
            <p className="text-sm text-chocolate-light dark:text-cream/60">Tax Invoice / Order Receipt</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold">{order.orderId}</p>
            <p className="text-chocolate-light dark:text-cream/60">{formatDate(order.createdAt)}</p>
            <span className="mt-1 inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Shipping + payment */}
        <div className="grid gap-6 py-5 sm:grid-cols-2">
          <div>
            <h3 className="mb-1 text-sm font-semibold uppercase text-chocolate-light dark:text-cream/50">Ship To</h3>
            <p className="font-medium">{order.shipping.name}</p>
            <p className="text-sm">{order.shipping.address}</p>
            <p className="text-sm">{order.shipping.city}, {order.shipping.state} - {order.shipping.pincode}</p>
            <p className="text-sm">📞 {order.shipping.mobile}</p>
            <p className="text-sm">📧 {order.shipping.email}</p>
          </div>
          <div className="sm:text-right">
            <h3 className="mb-1 text-sm font-semibold uppercase text-chocolate-light dark:text-cream/50">Payment</h3>
            <p className="text-sm">Method: {order.paymentMethod || '—'}</p>
            <p className="text-sm">Status: {order.paymentStatus}</p>
            <p className="text-sm">Txn: {order.transactionId || '—'}</p>
            <p className="text-sm">Est. Delivery: {formatDate(order.estimatedDelivery)}</p>
          </div>
        </div>

        {/* Items table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-y border-chocolate/10 dark:border-cream/10">
              <tr>
                <th className="py-2">Item</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it) => (
                <tr key={it.product} className="border-b border-chocolate/5 dark:border-cream/5">
                  <td className="py-2">{it.name}</td>
                  <td className="py-2 text-center">{it.quantity}</td>
                  <td className="py-2 text-right">{formatINR(it.price)}</td>
                  <td className="py-2 text-right">{formatINR(it.price * it.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="ml-auto mt-4 w-full max-w-xs space-y-1 text-sm">
          <Row label="Items Total" value={formatINR(order.itemsTotal)} />
          {order.discount > 0 && <Row label={`Discount (${order.couponCode})`} value={`- ${formatINR(order.discount)}`} />}
          <Row label="Delivery" value={order.deliveryCharge ? formatINR(order.deliveryCharge) : 'FREE'} />
          <Row label="GST (5%)" value={formatINR(order.gst)} />
          <div className="flex justify-between border-t border-chocolate/10 pt-2 text-base font-bold dark:border-cream/10">
            <span>Grand Total</span>
            <span>{formatINR(order.grandTotal)}</span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-chocolate-light dark:text-cream/50">
          Thank you for shopping with CocoaCraft! 🍫
        </p>
      </div>

      {/* Actions (hidden when printing) */}
      <div className="mt-4 flex flex-wrap gap-3 print:hidden">
        <button onClick={() => window.print()} className="btn-outline">
          <FaPrint /> Print / Download Invoice
        </button>
        {canCancel && (
          <button onClick={cancel} className="btn-outline !border-red-500 !text-red-500 hover:!bg-red-500 hover:!text-white">
            <FaTimesCircle /> Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-chocolate-light dark:text-cream/60">{label}</span>
      <span>{value}</span>
    </div>
  );
}
