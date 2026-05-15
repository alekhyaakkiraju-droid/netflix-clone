import { Link, useLocation } from 'react-router-dom';
import './Styles/Main.css';
import './Styles/Planwelcome.css';

/**
 * `/signup/plan` — Step 2 of 3: plan funnel intro before plan comparison (`/signup/planform`).
 */
export default function Planwelcome() {
  const location = useLocation();
  const { email } = location.state || {};

  return (
    <div className="planwelcome-page">
      <header className="planwelcome-top">
        <Link to="/" aria-label="Netflix home" className="planwelcome-logo-link">
          <img src="/Assets/Netflix-brand.png" alt="Netflix" height={45} />
        </Link>
        <Link to="/signup/logout" className="planwelcome-signout">
          Sign Out
        </Link>
      </header>

      <div className="planwelcome-main">
        <div className="planwelcome-card nf-planwelcome-card">
          <p className="nf-step-label planwelcome-step">STEP 2 OF 3</p>
          <h1 className="planwelcome-heading">Choose your plan.</h1>
          <ul className="planwelcome-benefits" aria-label="Plan benefits">
            <li>
              <span className="planwelcome-check" aria-hidden>
                ✓
              </span>
              <span>No commitments, cancel anytime.</span>
            </li>
            <li>
              <span className="planwelcome-check" aria-hidden>
                ✓
              </span>
              <span>Everything on Netflix for one low price.</span>
            </li>
            <li>
              <span className="planwelcome-check" aria-hidden>
                ✓
              </span>
              <span>No ads and no extra fees. Ever.</span>
            </li>
          </ul>
          <Link
            to="/signup/planform"
            state={{ email }}
            className="btn nf-btn-primary planwelcome-next"
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
