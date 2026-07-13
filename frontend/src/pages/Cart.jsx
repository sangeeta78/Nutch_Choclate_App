import { Link, useNavigate } from 'react-router-dom';
import { FaMinus, FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatINR } from '../utils/format.js';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="%23795548"/></svg>';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const checkout = () => {
    if (!user) return navigate('/login', { state: { from: { pathname: '/checkout' } } });
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 font-serif text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-chocolate-light dark:text-cream/60">
          Looks like you haven't added anything yet.
        </p>
        <Link to="/products" className="btn-gold mt-6">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 font-serif text-3xl font-bold">Your Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item._id} className="card flex gap-4 p-4">
              <img
                src={item.image || PLACEHOLDER}
                alt={item.name}
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                className="h-24 w-24 rounded-xl object-cover"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{item.name}</h3>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-600"
                    aria-label="Remove"
                  >
                    <FaTrash />
                  </button>
                </div>
                <p className="text-sm text-chocolate-light dark:text-cream/60">
                  {formatINR(item.price)} each
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-chocolate/20 dark:border-cream/20">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-3 py-1.5 hover:text-gold">
                      <FaMinus size={11} />
                    </button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-3 py-1.5 hover:text-gold">
                      <FaPlus size={11} />
                    </button>
                  </div>
                  <span className="font-bold">{formatINR(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
          <Link to="/products" className="inline-flex items-center gap-2 text-gold hover:underline">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="card h-fit p-6">
          <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
          <div className="flex justify-between py-2">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm text-chocolate-light dark:text-cream/60">
            <span>Delivery &amp; taxes</span>
            <span>Calculated at checkout</span>
          </div>
          <hr className="my-3 border-chocolate/10 dark:border-cream/10" />
          <div className="flex justify-between py-2 text-lg font-bold">
            <span>Total</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <button onClick={checkout} className="btn-gold mt-4 w-full">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
