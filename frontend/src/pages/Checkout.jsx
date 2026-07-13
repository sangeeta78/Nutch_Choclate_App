import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatINR } from '../utils/format.js';

export default function Checkout() {
  const { items, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    address: user?.address?.address || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [coupon, setCoupon] = useState('');
  const [pricing, setPricing] = useState(null);
  const [placing, setPlacing] = useState(false);

  // Redirect if cart empty
  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items, navigate]);

  // Fetch server-side pricing preview whenever items or coupon change
  const refreshPreview = async (couponCode = coupon) => {
    if (items.length === 0) return;
    try {
      const { data } = await api.post('/orders/preview', {
        items: items.map((i) => ({ product: i._id, quantity: i.quantity })),
        couponCode,
      });
      setPricing(data.pricing);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    refreshPreview('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyCoupon = async () => {
    await refreshPreview(coupon);
    if (coupon) toast.success('Coupon applied (if valid)');
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    // Basic validation
    for (const [k, v] of Object.entries(form)) {
      if (!v.trim()) return toast.error(`Please fill in your ${k}`);
    }
    if (!/^\d{10}$/.test(form.mobile)) return toast.error('Enter a valid 10-digit mobile number');
    if (!/^\d{6}$/.test(form.pincode)) return toast.error('Enter a valid 6-digit PIN code');

    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i._id, quantity: i.quantity })),
        shipping: form,
        couponCode: coupon,
      });
      // Move to the dummy payment gateway for this order
      navigate(`/payment/${data.order._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 font-serif text-3xl font-bold">Checkout</h1>
      <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-3">
        {/* Shipping details */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold">Delivery Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <Field label="Mobile Number" name="mobile" value={form.mobile} onChange={handleChange} />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Field label="PIN Code" name="pincode" value={form.pincode} onChange={handleChange} />
            <div className="sm:col-span-2">
              <label className="label">Delivery Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                className="input"
                placeholder="House no, street, area"
              />
            </div>
            <Field label="City" name="city" value={form.city} onChange={handleChange} />
            <Field label="State" name="state" value={form.state} onChange={handleChange} />
          </div>
        </div>

        {/* Order summary */}
        <div className="card h-fit p-6">
          <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
          <div className="max-h-40 space-y-2 overflow-y-auto pr-2 text-sm">
            {items.map((i) => (
              <div key={i._id} className="flex justify-between">
                <span className="line-clamp-1">{i.name} × {i.quantity}</span>
                <span>{formatINR(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="mt-4 flex gap-2">
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              placeholder="Coupon code"
              className="input"
            />
            <button type="button" onClick={applyCoupon} className="btn-outline !px-4">Apply</button>
          </div>
          <p className="mt-1 text-xs text-chocolate-light dark:text-cream/50">
            Try: SWEET10, COCOA20, FESTIVE25
          </p>

          <hr className="my-4 border-chocolate/10 dark:border-cream/10" />
          <Row label="Items Total" value={formatINR(pricing?.itemsTotal ?? subtotal)} />
          {pricing?.discount > 0 && (
            <Row label={`Discount (${pricing.couponCode})`} value={`- ${formatINR(pricing.discount)}`} highlight />
          )}
          <Row
            label="Delivery Charges"
            value={pricing?.deliveryCharge ? formatINR(pricing.deliveryCharge) : 'FREE'}
          />
          <Row label="GST (5%)" value={formatINR(pricing?.gst ?? 0)} />
          <hr className="my-3 border-chocolate/10 dark:border-cream/10" />
          <Row label="Grand Total" value={formatINR(pricing?.grandTotal ?? subtotal)} big />

          <button type="submit" disabled={placing} className="btn-gold mt-5 w-full">
            {placing ? 'Placing Order...' : 'Proceed to Payment'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" {...props} />
    </div>
  );
}

function Row({ label, value, big, highlight }) {
  return (
    <div className={`flex justify-between py-1 ${big ? 'text-lg font-bold' : ''} ${highlight ? 'text-green-600 dark:text-green-400' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
