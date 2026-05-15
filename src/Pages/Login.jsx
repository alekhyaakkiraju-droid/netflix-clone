import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/apiClient';
import './Styles/Main.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/browse';

  const [email, setEmail] = useState(() => location.state?.email ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Incorrect email or password. Please try again.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <header className="login-top">
        <Link to="/" aria-label="Netflix home">
          <img className="brand-logo" src="/Assets/Netflix-brand.png" alt="Netflix" />
        </Link>
      </header>
      <div className="login-card-outer">
        <div className="login-card">
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            {error && <div className="login-error" role="alert">{error}</div>}
            <input
              type="email"
              className="login-field"
              placeholder="Email or mobile number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              type="password"
              className="login-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="submit"
              className="btn btn-nf-signin"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="login-foot">
            New to Netflix?{' '}
            <Link to="/registration">Sign up now.</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
