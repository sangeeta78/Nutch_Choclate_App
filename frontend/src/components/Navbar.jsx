import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaShoppingCart, FaHeart, FaUser, FaMoon, FaSun, FaSearch, FaBars, FaTimes,
} from 'react-icons/fa';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const categories = ['Homemade Chocolates', 'Dry Fruits', 'Nuts', 'Gift Boxes'];

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/products?keyword=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-chocolate/10 bg-cream/95 backdrop-blur dark:border-cream/10 dark:bg-chocolate-dark/95">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-chocolate dark:text-gold">
          🍫 <span className="font-serif">Nutch Guiltfree Chocolate</span>
        </Link>

        {/* Search (desktop) */}
        <form onSubmit={submitSearch} className="ml-4 hidden flex-1 md:flex">
          <div className="relative w-full max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chocolates, nuts, gifts..."
              className="input pr-10"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate-light">
              <FaSearch />
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-3">
          <button onClick={toggle} className="p-2 text-lg hover:text-gold" aria-label="Toggle theme">
            {dark ? <FaSun /> : <FaMoon />}
          </button>

          <Link to="/wishlist" className="p-2 text-lg hover:text-gold" aria-label="Wishlist">
            <FaHeart />
          </Link>

          <Link to="/cart" className="relative p-2 text-lg hover:text-gold" aria-label="Cart">
            <FaShoppingCart />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-chocolate-dark">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Account dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 p-2 text-lg hover:text-gold">
              <FaUser />
            </button>
            <div className="invisible absolute right-0 top-full w-48 rounded-xl bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100 dark:bg-chocolate">
              {user ? (
                <>
                  <p className="px-3 py-2 text-sm font-semibold">Hi, {user.name.split(' ')[0]}</p>
                  <MenuLink to="/profile">Profile</MenuLink>
                  <MenuLink to="/orders">My Orders</MenuLink>
                  <MenuLink to="/wishlist">Wishlist</MenuLink>
                  {isAdmin && <MenuLink to="/admin">Admin Panel</MenuLink>}
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <MenuLink to="/login">Login</MenuLink>
                  <MenuLink to="/register">Register</MenuLink>
                </>
              )}
            </div>
          </div>

          <button className="p-2 text-lg md:hidden" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Category bar (desktop) */}
      <nav className="mx-auto hidden max-w-7xl gap-6 px-4 pb-2 md:flex">
        <Link to="/products" className="text-sm font-medium hover:text-gold">All Products</Link>
        {categories.map((c) => (
          <Link
            key={c}
            to={`/products?category=${encodeURIComponent(c)}`}
            className="text-sm font-medium hover:text-gold"
          >
            {c}
          </Link>
        ))}
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-chocolate/10 px-4 py-3 md:hidden dark:border-cream/10">
          <form onSubmit={submitSearch} className="mb-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="input"
            />
          </form>
          <div className="flex flex-col gap-2">
            <Link to="/products" onClick={() => setMenuOpen(false)} className="py-1">All Products</Link>
            {categories.map((c) => (
              <Link
                key={c}
                to={`/products?category=${encodeURIComponent(c)}`}
                onClick={() => setMenuOpen(false)}
                className="py-1"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function MenuLink({ to, children }) {
  return (
    <Link to={to} className="block rounded-lg px-3 py-2 text-sm hover:bg-cream dark:hover:bg-chocolate-dark">
      {children}
    </Link>
  );
}
