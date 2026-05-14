import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import { ApiError } from '../services/apiClient';

/**
 * PCI-DSS compliant payment form.
 * Raw card numbers are NEVER sent to our server.
 * In production, replace the mock tokenizer with Stripe.js Elements.
 * This component receives a paymentMethodToken from the tokenization layer.
 */
function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan ?? 'STANDARD';

  const [cardDisplay, setCardDisplay] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
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
    if (digits.length < 16) { setError('Please enter a complete card number.'); return; }
    if (!expiry.match(/^\d{2}\/\d{2}$/)) { setError('Invalid expiry date.'); return; }
    if (cvv.length < 3) { setError('Invalid CVV.'); return; }

    setLoading(true);
    try {
      /**
       * In production: call Stripe.js createPaymentMethod() here to tokenize.
       * The mock token below simulates what Stripe would return (pm_xxx).
       */
      const mockToken = `pm_mock_${Date.now()}`;
      const last4 = digits.slice(-4);

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
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: '100vh', background: '#141414', color: 'white' }}
      >
        <div className="fs-1 mb-3">✅</div>
        <h2>Payment successful!</h2>
        <p className="text-secondary">Redirecting to browse…</p>
      </div>
    );
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', background: 'rgba(0,0,0,0.85)' }}
    >
      <div
        className="p-5 rounded"
        style={{ background: '#141414', width: '100%', maxWidth: 480 }}
      >
        <h2 className="text-white mb-1">Payment Details</h2>
        <p className="text-secondary mb-4">{planLabels[selectedPlan] ?? selectedPlan}</p>

        <div className="alert alert-info py-2 small mb-4">
          🔒 Your card details are tokenized by Stripe and never sent to our server.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-secondary small">Card Number</label>
            <input
              className="form-control bg-secondary text-white border-0"
              placeholder="1234 5678 9012 3456"
              value={cardDisplay}
              onChange={(e) => setCardDisplay(formatCard(e.target.value))}
              inputMode="numeric"
              autoComplete="cc-number"
              required
            />
          </div>
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="text-secondary small">Expiry (MM/YY)</label>
              <input
                className="form-control bg-secondary text-white border-0"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                inputMode="numeric"
                autoComplete="cc-exp"
                required
              />
            </div>
            <div className="col-6">
              <label className="text-secondary small">CVV</label>
              <input
                className="form-control bg-secondary text-white border-0"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                inputMode="numeric"
                autoComplete="cc-csc"
                required
              />
            </div>
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <button
            type="submit"
            className="btn btn-danger w-100 fw-bold"
            disabled={loading}
          >
            {loading ? 'Processing…' : `Pay ${planLabels[selectedPlan]?.split('–')[1]?.trim() ?? ''}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentGateway;
