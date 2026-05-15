import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Styles/Main.css';
import './Styles/PaymentPicker.css';

export default function PaymentPicker() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCard, packagePrice, email } = location.state || {};

  function paymentPicked() {
    navigate('/signup/pay', { state: { selectedCard, packagePrice, email } });
  }

  return (
    <div className="nf-auth-shell payment-picker-page">
      <Link to="/signup/logout" className="nf-signout-link">
        Sign Out
      </Link>
      <header className="nf-auth-top">
        <Link to="/" aria-label="Netflix home">
          <img className="brand-logo" src="/Assets/Netflix-brand.png" alt="Netflix" />
        </Link>
      </header>
      <div className="nf-auth-card-outer payment-picker-outer">
        <div className="nf-auth-card payment-picker-card">
          <p className="nf-step-label">Step 3 of 3</p>
          <h1 className="nf-flow-title">Choose how to pay</h1>
          <p className="payment-picker-lead">
            Your payment is encrypted and you can change how you pay anytime.
          </p>
          <p className="payment-picker-tagline">
            Secure for peace of mind.
            <br />
            Cancel easily online.
          </p>

          <div className="payment-secure-badge">
            <i className="bi bi-shield-lock" aria-hidden /> End-to-end encrypted
          </div>

          <button type="button" className="payment-method-btn" onClick={paymentPicked}>
            <span>Credit or Debit Card</span>
            <span className="payment-picker-logos">
              <img src="/Assets/visa.png" alt="" />
              <img src="/Assets/master.png" alt="" />
              <img src="/Assets/amex.png" alt="" />
            </span>
            <i className="bi bi-chevron-right payment-chevron" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
