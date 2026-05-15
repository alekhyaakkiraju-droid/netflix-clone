import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Styles/Main.css';
import './Styles/Registration.css';

/**
 * `/registration` — Step 1 intro; account details are collected on `/signup`.
 */
function Registration() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  function handleNext() {
    navigate('/signup', { state: { email } });
  }

  return (
    <div className="registration-intro-page">
      <Link to="/signup/logout" className="registration-intro-signout">
        Sign Out
      </Link>
      <header className="registration-intro-header">
        <Link to="/" aria-label="Netflix home" className="registration-intro-brand">
          <span className="registration-intro-wordmark">NETFLIX</span>
        </Link>
      </header>

      <div className="registration-intro-outer">
        <div className="registration-intro-card">
          <div className="registration-intro-devices" aria-hidden>
            <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" className="registration-intro-devices-svg">
              <rect width="320" height="240" fill="#f3f3f3" rx="8" />
              <rect x="32" y="40" width="120" height="80" fill="#1a1a1a" rx="4" />
              <rect x="168" y="48" width="72" height="120" fill="#2a2a2a" rx="6" />
              <rect x="248" y="100" width="40" height="72" fill="#e50914" rx="4" />
              <text x="92" y="164" textAnchor="middle" fill="#737373" fontSize="12" fontFamily="system-ui, sans-serif">
                TV · Phone · Tablet
              </text>
            </svg>
          </div>
          <p className="nf-step-label registration-intro-step">STEP 1 OF 3</p>
          <h1 className="registration-intro-title">Finish setting up your account.</h1>
          <p className="registration-intro-sub">
            Netflix is personalized for you. Create a password to watch on any device at any time.
          </p>
          <button type="button" className="btn nf-btn-primary registration-intro-next" onClick={handleNext}>
            Next
          </button>
          <p className="registration-intro-foot">
            Already a member? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registration;
