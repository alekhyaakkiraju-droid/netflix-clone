import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/apiClient';

function Registration() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      navigate('/browse');
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError('An account with this email already exists.');
      } else if (err instanceof ApiError && err.status === 422) {
        setError(err.data?.details?.[0]?.message ?? 'Invalid input.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', background: 'rgba(0,0,0,0.85)' }}
    >
      <div
        className="p-5 rounded"
        style={{ background: '#141414', width: '100%', maxWidth: 450 }}
      >
        <h1 className="text-white mb-4" style={{ fontWeight: 700 }}>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control bg-secondary text-white border-0"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control bg-secondary text-white border-0"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control bg-secondary text-white border-0"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <button
            type="submit"
            className="btn btn-danger w-100 fw-bold"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Get Started'}
          </button>
        </form>
        <p className="text-secondary mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-white">Sign in.</Link>
        </p>
      </div>
    </div>
  );
}

export default Registration;
