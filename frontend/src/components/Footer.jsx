import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-chocolate/10 bg-chocolate text-cream dark:bg-chocolate-dark">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="mb-3 text-xl font-bold text-gold">🍫 CocoaCraft</h3>
          <p className="text-sm text-cream/70">
            Premium handmade chocolates, dry fruits, nuts, and curated gift boxes — crafted
            fresh, delivered with love.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Shop</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/products?category=Homemade Chocolates" className="hover:text-gold">Chocolates</Link></li>
            <li><Link to="/products?category=Dry Fruits" className="hover:text-gold">Dry Fruits</Link></li>
            <li><Link to="/products?category=Nuts" className="hover:text-gold">Nuts</Link></li>
            <li><Link to="/products?category=Gift Boxes" className="hover:text-gold">Gift Boxes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Account</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/profile" className="hover:text-gold">My Profile</Link></li>
            <li><Link to="/orders" className="hover:text-gold">My Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-gold">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-gold">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Contact</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>📧 hello@cocoacraft.com</li>
            <li>📞 +91 99999 99999</li>
            <li>📍 Mumbai, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-sm text-cream/60">
        © {new Date().getFullYear()} CocoaCraft. All rights reserved. Made with 🍫 &amp; ❤️
      </div>
    </footer>
  );
}
