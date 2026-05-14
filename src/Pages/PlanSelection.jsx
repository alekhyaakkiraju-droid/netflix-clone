import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PLANS = [
  {
    id: 'MOBILE',
    name: 'Mobile',
    price: '$6.99/mo',
    features: ['Mobile & tablet', '480p', '1 device at a time'],
  },
  {
    id: 'STANDARD_WITH_ADS',
    name: 'Standard with Ads',
    price: '$6.99/mo',
    features: ['TV, mobile, tablet', '1080p Full HD', '2 devices at a time', 'Some ads'],
  },
  {
    id: 'STANDARD',
    name: 'Standard',
    price: '$15.49/mo',
    recommended: false,
    features: ['TV, mobile, tablet', '1080p Full HD', '2 devices at a time', 'No ads'],
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: '$22.99/mo',
    recommended: true,
    features: ['TV, mobile, tablet', '4K Ultra HD + HDR', '4 devices at a time', 'Spatial audio', 'No ads'],
  },
];

function PlanSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('PREMIUM');

  function handleContinue() {
    navigate('/payment', { state: { plan: selected } });
  }

  return (
    <div style={{ background: '#141414', minHeight: '100vh', color: 'white' }} className="py-5 px-3">
      <div className="text-center mb-5">
        <h1 style={{ fontWeight: 700 }}>Choose your plan.</h1>
        <p className="text-secondary">Downgrade or upgrade at any time.</p>
      </div>

      <div className="row justify-content-center g-3 mb-5">
        {PLANS.map((plan) => (
          <div key={plan.id} className="col-6 col-md-3">
            <div
              className={`card h-100 border-2 ${selected === plan.id ? 'border-danger' : 'border-secondary'}`}
              style={{
                background: selected === plan.id ? '#1a1a1a' : '#0d0d0d',
                cursor: 'pointer',
              }}
              onClick={() => setSelected(plan.id)}
            >
              <div className="card-body p-3">
                {plan.recommended && (
                  <span className="badge bg-danger mb-2">Best Value</span>
                )}
                <h5 className="text-white">{plan.name}</h5>
                <p className="text-danger fw-bold">{plan.price}</p>
                <ul className="text-secondary small ps-3">
                  {plan.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
              {selected === plan.id && (
                <div className="card-footer bg-danger text-center text-white py-1 small">Selected ✓</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="btn btn-danger btn-lg px-5" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

export default PlanSelection;
