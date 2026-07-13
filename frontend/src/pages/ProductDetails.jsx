import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaHeart, FaRegHeart, FaShoppingCart, FaMinus, FaPlus,
} from 'react-icons/fa';
import api from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import Rating from '../components/Rating.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatINR } from '../utils/format.js';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="100%" height="100%" fill="%23795548"/><text x="50%" y="50%" fill="%23FFF8E1" font-size="28" text-anchor="middle" dy=".3em">CocoaCraft</text></svg>';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setProduct(data.product);
        setActiveImg(0);
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
    api.get(`/products/${id}/related`).then(({ data }) => setRelated(data.products));
  };

  useEffect(() => {
    load();
    // Record recently viewed for logged-in users
    if (user) api.post(`/users/recently-viewed/${id}`).catch(() => {});
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const buyNow = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to review');
      return navigate('/login');
    }
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      toast.success('Review submitted');
      setComment('');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;
  if (!product) return null;

  const images = product.images?.length ? product.images : [PLACEHOLDER];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="card overflow-hidden">
            <img
              src={images[activeImg]}
              alt={product.name}
              onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              className="h-[420px] w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${
                    activeImg === i ? 'border-gold' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-sm uppercase tracking-wide text-gold">{product.category}</span>
          <h1 className="mt-1 font-serif text-3xl font-bold">{product.name}</h1>
          <div className="mt-2">
            <Rating value={product.rating} count={product.numReviews} size="text-base" />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-chocolate dark:text-gold">
              {formatINR(product.finalPrice ?? product.price)}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-chocolate-light line-through dark:text-cream/50">
                  {formatINR(product.price)}
                </span>
                <span className="rounded-full bg-gold px-3 py-1 text-sm font-bold text-chocolate-dark">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-chocolate-light dark:text-cream/70">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-white p-4 dark:bg-chocolate">
            <Detail label="Weight" value={product.weight} />
            <Detail label="Shelf Life" value={product.shelfLife} />
            <Detail label="Ingredients" value={product.ingredients} full />
            <Detail
              label="Availability"
              value={product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            />
          </dl>

          {/* Quantity selector */}
          <div className="mt-6 flex items-center gap-4">
            <span className="font-medium">Quantity</span>
            <div className="flex items-center rounded-full border border-chocolate/20 dark:border-cream/20">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:text-gold"
              >
                <FaMinus size={12} />
              </button>
              <span className="w-10 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-2 hover:text-gold"
              >
                <FaPlus size={12} />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              disabled={product.stock === 0}
              onClick={() => addToCart(product, qty)}
              className="btn-outline"
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button disabled={product.stock === 0} onClick={buyNow} className="btn-gold">
              Buy Now
            </button>
            <button onClick={() => toggle(product)} className="btn-outline !px-4">
              {isWishlisted(product._id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-14">
        <h2 className="mb-6 font-serif text-2xl font-bold">Ratings &amp; Reviews</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {product.reviews?.length ? (
              product.reviews.map((r) => (
                <div key={r._id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{r.name}</span>
                    <Rating value={r.rating} />
                  </div>
                  <p className="mt-2 text-sm text-chocolate-light dark:text-cream/70">{r.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-chocolate-light dark:text-cream/60">No reviews yet. Be the first!</p>
            )}
          </div>

          {/* Write a review */}
          <form onSubmit={submitReview} className="card h-fit p-5">
            <h3 className="mb-3 font-semibold">Write a Review</h3>
            <label className="label">Rating</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="input mb-3">
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
              ))}
            </select>
            <label className="label">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="input mb-3"
              placeholder="Share your experience..."
            />
            <button type="submit" className="btn-primary w-full">Submit Review</button>
          </form>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 font-serif text-2xl font-bold">You May Also Like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Detail({ label, value, full }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <dt className="text-xs uppercase text-chocolate-light dark:text-cream/50">{label}</dt>
      <dd className="font-medium">{value || '—'}</dd>
    </div>
  );
}
