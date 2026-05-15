import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { ApiError } from '../services/apiClient';
import './Styles/Main.css';
import './Styles/PaymentGateway.css';

/** Maps Planform `selectedCard` strings to API plan codes (POST /payments/proceed). */
export function mapPlanformCardToPlan(selectedCard) {
  const m = {
    Premium: 'PREMIUM',
    Standerd: 'STANDARD',
    Basic: 'STANDARD_WITH_ADS',
    Mobile: 'MOBILE',
  };
  return m[selectedCard];
}

/**
 * PCI-DSS compliant payment form.
 * Raw card numbers are NEVER sent to our server.
 * In production, replace the mock tokenizer with Stripe.js Elements.
 */
function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const selectedPlan =
    state.plan ??
    mapPlanformCardToPlan(state.selectedCard) ??
    'STANDARD';

  const [cardDisplay, setCardDisplay] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function formatCard(value) {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})/g, '$1 ').trim();
  }

  function formatExpiry(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const digits = cardDisplay.replace(/\s/g, '');
    if (digits.length < 16) {
      setError('Please enter a complete card number.');
      return;
    }
    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
      setError('Invalid expiry date.');
      return;
    }
    if (cvv.length < 3) {
      setError('Invalid CVV.');
      return;
    }

    setLoading(true);
    try {
      const mockToken = `pm_mock_${Date.now()}`;
      await paymentService.proceed(selectedPlan, mockToken);
      setSuccess(true);
      setTimeout(() => navigate('/browse'), 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message ?? 'Payment failed. Please try again.');
      } else {
        setError('Payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  const planLabels = {
    MOBILE: 'Mobile – $6.99/mo',
    STANDARD: 'Standard – $15.49/mo',
    STANDARD_WITH_ADS: 'Standard with Ads – $6.99/mo',
    PREMIUM: 'Premium – $22.99/mo',
  };

  if (success) {
    return (
      <div className="nf-auth-shell pay-success-shell">
        <header className="nf-auth-top">
          <Link to="/" aria-label="Netflix home">
            <img className="brand-logo" src="/Assets/Netflix-brand.png" alt="Netflix" />
          </Link>
        </header>
        <div className="nf-auth-card-outer">
          <div className="nf-auth-card pay-success-card">
            <div className="pay-success-icon" aria-hidden>
              <i className="bi bi-check-circle-fill" />
            </div>
            <h1 className="pay-success-title">You&apos;re all set!</h1>
            <p className="pay-success-sub">Redirecting you to Netflix…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nf-auth-shell">
      <header className="nf-auth-top">
        <Link to="/" aria-label="Netflix home">
          <img className="brand-logo" src="/Assets/Netflix-brand.png" alt="Netflix" />
        </Link>
      </header>
      <div className="nf-auth-card-outer payment-card-outer">
        <div className="nf-auth-card payment-card">
          <p className="nf-step-label">Step 3 of 3</p>
          <h1 className="nf-flow-title payment-title">Set up your credit or debit card</h1>
          <p className="payment-plan-line">{planLabels[selectedPlan] ?? selectedPlan}</p>

          <div className="payment-card-logos" aria-hidden>
            <img src="/Assets/visa.png" alt="" className="pay-logo" />
            <img src="/Assets/master.png" alt="" className="pay-logo" />
            <img src="/Assets/amex.png" alt="" className="pay-logo" />
          </div>

          <p className="payment-secure-note">
            <i className="bi bi-lock-fill" aria-hidden /> Your payment is secured. In production, card
            data is tokenized and never stored on our servers.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="nf-auth-error" role="alert">
                {error}
              </div>
            )}

            <div className="nf-field-wrap">
              <input
                id="pay-name"
                type="text"
                className="nf-float-input"
                placeholder=" "
                autoComplete="cc-name"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
              />
              <label className="nf-float-label" htmlFor="pay-name">
                Name on card
              </label>
            </div>

            <div className="nf-field-wrap">
              <input
                id="pay-card"
                type="text"
                className="nf-float-input"
                placeholder=" "
                inputMode="numeric"
                autoComplete="cc-number"
                value={cardDisplay}
                onChange={(e) => setCardDisplay(formatCard(e.target.value))}
                required
              />
              <label className="nf-float-label" htmlFor="pay-card">
                Card number
              </label>
            </div>

            <div className="payment-row-2">
              <div className="nf-field-wrap">
                <input
                  id="pay-exp"
                  type="text"
                  className="nf-float-input"
                  placeholder=" "
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  required
                />
                <label className="nf-float-label" htmlFor="pay-exp">
                  Expiration date
                </label>
              </div>
              <div className="nf-field-wrap">
                <input
                  id="pay-cvv"
                  type="password"
                  className="nf-float-input"
                  placeholder=" "
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  required
                />
                <label className="nf-float-label" htmlFor="pay-cvv">
                  CVV
                </label>
              </div>
            </div>

            <button type="submit" className="btn nf-btn-primary" disabled={loading}>
              {loading ? 'Processing…' : 'Start Membership'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentGateway;
