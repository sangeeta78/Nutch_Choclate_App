import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import Rating from './Rating.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { formatINR } from '../utils/format.js';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="%23795548"/><text x="50%" y="50%" fill="%23FFF8E1" font-size="24" text-anchor="middle" dy=".3em">Nutch Guiltfree Chocolate</text></svg>';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const navigate = useNavigate();

  const inStock = product.stock > 0;

  const buyNow = () => {
    addToCart(product, 1);
    navigate('/cart');
  };

  return (
    <div className="card group flex flex-col overflow-hidden animate-fade-in">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images?.[0] || PLACEHOLDER}
            alt={product.name}
            onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Discount badge */}
        {product.discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-chocolate-dark">
            {product.discount}% OFF
          </span>
        )}

        {/* Wishlist toggle */}
        <button
          onClick={() => toggle(product)}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-chocolate shadow hover:scale-110 transition"
          aria-label="Toggle wishlist"
        >
          {isWishlisted(product._id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>

        {!inStock && (
          <span className="absolute inset-x-0 bottom-0 bg-red-600/90 py-1 text-center text-sm font-semibold text-white">
            Out of Stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs uppercase tracking-wide text-gold">{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="mt-1 line-clamp-1 text-lg font-semibold hover:text-gold">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-chocolate-light dark:text-cream/70">
          {product.description}
        </p>

        <div className="mt-2">
          <Rating value={product.rating} count={product.numReviews} />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-xl font-bold text-chocolate dark:text-gold">
            {formatINR(product.finalPrice ?? product.price)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-chocolate-light line-through dark:text-cream/50">
              {formatINR(product.price)}
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            disabled={!inStock}
            onClick={() => addToCart(product, 1)}
            className="btn-outline flex-1 !px-3 !py-2 text-sm"
          >
            <FaShoppingCart /> Add
          </button>
          <button
            disabled={!inStock}
            onClick={buyNow}
            className="btn-gold flex-1 !px-3 !py-2 text-sm"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
