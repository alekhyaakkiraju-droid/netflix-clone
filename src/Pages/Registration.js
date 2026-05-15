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
        <Link to="/" aria-label="Netflix home">
          <img className="brand-logo" src="/Assets/Netflix-brand.png" alt="Netflix" height={45} />
        </Link>
      </header>

      <div className="registration-intro-outer">
        <div className="registration-intro-card">
          <img
            className="registration-intro-devices"
            src="/Assets/register-img.png"
            alt=""
          />
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
