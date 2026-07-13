import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome Back" subtitle="Log in to your Nutch Guiltfree Chocolate account">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-gold hover:underline">
            Forgot password?
          </Link>
        </div>
        <button type="submit" disabled={loading} className="btn-gold w-full">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-gold hover:underline">Register</Link>
      </p>
      <p className="mt-3 text-center text-xs text-chocolate-light dark:text-cream/50">
        Demo: customer@nutch.com / Customer@123
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-8">
      <div className="card w-full p-8">
        <div className="mb-6 text-center">
          <div className="text-4xl">🍫</div>
          <h1 className="mt-2 font-serif text-2xl font-bold">{title}</h1>
          <p className="text-sm text-chocolate-light dark:text-cream/60">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
