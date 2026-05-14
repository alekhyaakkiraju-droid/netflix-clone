import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Logout page:
 * 1. Clears access + refresh tokens from localStorage via useAuth().logout()
 * 2. Redirects to /login immediately
 *
 * Note: The refresh token is stateless (JWT) so no server-side revocation call is needed.
 * A future improvement is to maintain a server-side token denylist for immediate revocation.
 */
function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh', background: '#141414', color: 'white' }}
    >
      <div className="text-center">
        <div className="spinner-border text-danger mb-3" />
        <p>Signing out…</p>
      </div>
    </div>
  );
}

export default Logout;
