import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { AuthShell } from './Login.jsx';

// Two-step mock reset: request a token, then set a new password.
export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const requestToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      // In this demo the token is returned directly (mock email service)
      if (data.resetToken) {
        setToken(data.resetToken);
        toast.success('Reset token generated (auto-filled for demo)');
      } else {
        toast.success(data.message);
      }
      setStep(2);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      toast.success('Password reset! Please log in.');
      window.location.href = '/login';
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Reset Password" subtitle={step === 1 ? 'Enter your email' : 'Set a new password'}>
      {step === 1 ? (
        <form onSubmit={requestToken} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? 'Sending...' : 'Send Reset Token'}
          </button>
        </form>
      ) : (
        <form onSubmit={resetPassword} className="space-y-4">
          <div>
            <label className="label">Reset Token</label>
            <input className="input" value={token} onChange={(e) => setToken(e.target.value)} required />
          </div>
          <div>
            <label className="label">New Password</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm">
        <Link to="/login" className="font-semibold text-gold hover:underline">Back to Login</Link>
      </p>
    </AuthShell>
  );
}
