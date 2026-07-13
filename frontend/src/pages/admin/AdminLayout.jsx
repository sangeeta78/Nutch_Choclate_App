import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaBoxOpen, FaClipboardList, FaUsers, FaStore, FaSignOutAlt,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';

const links = [
  { to: '/admin', label: 'Dashboard', icon: FaTachometerAlt, end: true },
  { to: '/admin/products', label: 'Products', icon: FaBoxOpen },
  { to: '/admin/orders', label: 'Orders', icon: FaClipboardList },
  { to: '/admin/customers', label: 'Customers', icon: FaUsers },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-cream dark:bg-chocolate-dark">
      {/* Sidebar */}
      <aside className="flex w-16 flex-col bg-chocolate text-cream sm:w-60">
        <div className="flex items-center gap-2 px-4 py-5 text-xl font-bold text-gold">
          🍫 <span className="hidden sm:inline font-serif">Admin</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-2">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-gold text-chocolate-dark' : 'hover:bg-chocolate-light'
                  }`
                }
              >
                <Icon /> <span className="hidden sm:inline">{l.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="px-2 pb-4">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-chocolate-light">
            <FaStore /> <span className="hidden sm:inline">View Store</span>
          </Link>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-300 hover:bg-chocolate-light"
          >
            <FaSignOutAlt /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-x-hidden">
        <header className="flex items-center justify-between border-b border-chocolate/10 bg-white px-6 py-4 dark:border-cream/10 dark:bg-chocolate">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <span className="text-sm text-chocolate-light dark:text-cream/60">
            {user?.name}
          </span>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
