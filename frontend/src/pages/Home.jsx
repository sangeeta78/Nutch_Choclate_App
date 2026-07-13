import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';

const categories = [
  {
    name: 'Homemade Chocolates',
    emoji: '🍫',
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&q=80',
  },
  {
    name: 'Dry Fruits',
    emoji: '🍇',
    image: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=600&q=80',
  },
  {
    name: 'Nuts',
    emoji: '🥜',
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&q=80',
  },
  {
    name: 'Gift Boxes',
    emoji: '🎁',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80',
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products/featured')
      .then(({ data }) => setFeatured(data.products))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-chocolate to-chocolate-dark text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fade-in">
            <p className="mb-3 inline-block rounded-full bg-gold/20 px-4 py-1 text-sm text-gold">
              ✨ Handcrafted in small batches
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
              Indulge in <span className="text-gold">Pure Cocoa</span> Bliss
            </h1>
            <p className="mt-4 max-w-md text-cream/80">
              Premium homemade chocolates, hand-picked dry fruits, roasted nuts, and elegant
              gift boxes — delivered fresh to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products" className="btn-gold">Shop Now</Link>
              <Link to="/products?category=Gift Boxes" className="btn-outline !border-cream !text-cream hover:!bg-cream hover:!text-chocolate">
                Explore Gift Boxes
              </Link>
            </div>
          </div>
          <div className="animate-scale-in">
            <img
              src="https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=80"
              alt="Assorted chocolates"
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-8 text-center font-serif text-3xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/products?category=${encodeURIComponent(c.name)}`}
              className="card group relative overflow-hidden"
            >
              <img
                src={c.image}
                alt={c.name}
                className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-chocolate-dark/50 text-cream">
                <span className="text-3xl">{c.emoji}</span>
                <span className="mt-1 font-semibold">{c.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-3xl font-bold">Featured Treats</h2>
          <Link to="/products" className="text-gold hover:underline">View all →</Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Trust badges */}
      <section className="bg-white py-10 dark:bg-chocolate">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 text-center md:grid-cols-4">
          {[
            ['🚚', 'Free Delivery', 'On orders above ₹999'],
            ['🌿', '100% Natural', 'No preservatives'],
            ['🎁', 'Perfect Gifting', 'Elegant packaging'],
            ['🔒', 'Secure Checkout', 'Safe & simple'],
          ].map(([icon, title, sub]) => (
            <div key={title}>
              <div className="text-3xl">{icon}</div>
              <h3 className="mt-2 font-semibold">{title}</h3>
              <p className="text-sm text-chocolate-light dark:text-cream/60">{sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
