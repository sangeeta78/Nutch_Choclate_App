import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaMobileAlt, FaUniversity, FaCreditCard, FaWallet, FaLock,
} from 'react-icons/fa';
import api from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatINR } from '../utils/format.js';

const METHODS = [
  { key: 'UPI', label: 'UPI', icon: FaMobileAlt },
  { key: 'Net Banking', label: 'Net Banking', icon: FaUniversity },
  { key: 'Credit Card', label: 'Credit Card', icon: FaCreditCard },
  { key: 'Debit Card', label: 'Debit Card', icon: FaCreditCard },
  { key: 'Wallet', label: 'Wallet', icon: FaWallet },
];

const BANKS = ['SBI', 'HDFC', 'ICICI', 'Axis', 'PNB'];
const WALLETS = ['PhonePe', 'Google Pay', 'Paytm'];

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);

  // Method-specific fields
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('SBI');
  const [wallet, setWallet] = useState('PhonePe');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', holder: '' });

  useEffect(() => {
    api
      .get(`/orders/${orderId}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => {
        toast.error('Order not found');
        navigate('/cart');
      })
      .finally(() => setLoading(false));
  }, [orderId, navigate]);

  // Lightweight validation per method before we simulate the charge
  const validate = () => {
    if (method === 'UPI') {
      if (!/^[\w.\-]+@[\w]+$/.test(upiId)) return 'Enter a valid UPI ID (e.g. name@bank)';
    }
    if (method === 'Credit Card' || method === 'Debit Card') {
      if (!/^\d{16}$/.test(card.number.replace(/\s/g, ''))) return 'Card number must be 16 digits';
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return 'Expiry must be MM/YY';
      if (!/^\d{3}$/.test(card.cvv)) return 'CVV must be 3 digits';
      if (!card.holder.trim()) return 'Enter card holder name';
    }
    return null;
  };

  const pay = async () => {
    const error = validate();
    if (error) return toast.error(error);

    setProcessing(true);
    // Simulate gateway processing delay (~3 seconds)
    setTimeout(async () => {
      try {
        const provider =
          method === 'Net Banking' ? bank : method === 'Wallet' ? wallet : '';
        const { data } = await api.post('/payments/process', {
          orderId,
          method,
          provider,
        });
        clearCart();
        toast.success('Payment successful!');
        navigate(`/order-success/${orderId}`, {
          state: {
            transactionId: data.payment.transactionId,
            method: data.payment.method,
          },
        });
      } catch (err) {
        toast.error(err.message);
        setProcessing(false);
      }
    }, 3000);
  };

  if (loading) return <Loader />;
  if (!order) return null;

  // Full-screen processing overlay
  if (processing) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">🍫</div>
        </div>
        <h2 className="font-serif text-2xl font-bold">Processing your payment...</h2>
        <p className="text-chocolate-light dark:text-cream/60">
          Please do not refresh or close this window.
        </p>
        <div className="rounded-full bg-white px-4 py-2 text-sm shadow dark:bg-chocolate">
          Paying {formatINR(order.grandTotal)} via {method}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Fake secure gateway header */}
      <div className="mb-6 flex items-center justify-between rounded-t-2xl bg-chocolate px-6 py-4 text-cream">
        <div className="flex items-center gap-2 font-semibold">
          <FaLock className="text-gold" /> NutchPay Secure Gateway
        </div>
        <span className="text-sm">Order #{order.orderId}</span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Method selector */}
        <div className="card p-4">
          <h3 className="mb-3 font-semibold">Payment Method</h3>
          <div className="flex flex-col gap-2">
            {METHODS.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                    method === m.key
                      ? 'bg-gold text-chocolate-dark'
                      : 'bg-cream text-chocolate hover:bg-gold/20 dark:bg-chocolate-dark dark:text-cream'
                  }`}
                >
                  <Icon /> {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Method form */}
        <div className="card p-6 md:col-span-2">
          <h3 className="mb-4 text-lg font-bold">{method}</h3>

          {method === 'UPI' && (
            <div>
              <label className="label">UPI ID</label>
              <input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="input"
              />
            </div>
          )}

          {method === 'Net Banking' && (
            <div>
              <label className="label">Select Bank</label>
              <select value={bank} onChange={(e) => setBank(e.target.value)} className="input">
                {BANKS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
          )}

          {(method === 'Credit Card' || method === 'Debit Card') && (
            <div className="grid gap-4">
              <div>
                <label className="label">Card Number</label>
                <input
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Expiry (MM/YY)</label>
                  <input
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                    placeholder="12/28"
                    maxLength={5}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">CVV</label>
                  <input
                    type="password"
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    placeholder="123"
                    maxLength={3}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="label">Card Holder Name</label>
                <input
                  value={card.holder}
                  onChange={(e) => setCard({ ...card, holder: e.target.value })}
                  placeholder="Name on card"
                  className="input"
                />
              </div>
            </div>
          )}

          {method === 'Wallet' && (
            <div>
              <label className="label">Select Wallet</label>
              <div className="grid grid-cols-3 gap-3">
                {WALLETS.map((w) => (
                  <button
                    key={w}
                    onClick={() => setWallet(w)}
                    className={`rounded-xl px-3 py-4 text-sm font-medium transition ${
                      wallet === w
                        ? 'bg-gold text-chocolate-dark'
                        : 'bg-cream text-chocolate dark:bg-chocolate-dark dark:text-cream'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-xl bg-cream p-4 dark:bg-chocolate-dark">
            <div className="flex justify-between text-lg font-bold">
              <span>Amount Payable</span>
              <span>{formatINR(order.grandTotal)}</span>
            </div>
          </div>

          <button onClick={pay} className="btn-gold mt-4 w-full">
            Pay {formatINR(order.grandTotal)}
          </button>
          <p className="mt-3 text-center text-xs text-chocolate-light dark:text-cream/50">
            🔒 This is a dummy gateway for demonstration. No real money is charged.
          </p>
        </div>
      </div>
    </div>
  );
}
