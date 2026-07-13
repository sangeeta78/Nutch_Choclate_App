import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function Wishlist() {
  const { products } = useWishlist();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 font-serif text-3xl font-bold">My Wishlist</h1>
      {products.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl">💛</div>
          <p className="mt-3 text-chocolate-light dark:text-cream/60">Your wishlist is empty.</p>
          <Link to="/products" className="btn-gold mt-4">Discover Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
