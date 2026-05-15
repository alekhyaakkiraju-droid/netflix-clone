import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Styles/Main.css';
import './Styles/Planform.css';

const PLANS = [
  {
    id: 'MOBILE',
    name: 'Mobile',
    price: '$6.99',
    period: '/mo',
    videoQuality: 'Good',
    resolution: '480p',
    screens: '1',
    downloadDevices: '1',
    hasUhd: false,
    hasSpatial: false,
    hasAds: false,
  },
  {
    id: 'STANDARD_WITH_ADS',
    name: 'Standard with ads',
    price: '$6.99',
    period: '/mo',
    videoQuality: 'Great',
    resolution: '1080p (Full HD)',
    screens: '2',
    downloadDevices: '2',
    hasUhd: false,
    hasSpatial: false,
    hasAds: true,
  },
  {
    id: 'STANDARD',
    name: 'Standard',
    price: '$15.49',
    period: '/mo',
    videoQuality: 'Great',
    resolution: '1080p (Full HD)',
    screens: '2',
    downloadDevices: '2',
    hasUhd: false,
    hasSpatial: false,
    hasAds: false,
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: '$22.99',
    period: '/mo',
    videoQuality: 'Best',
    resolution: '4K (Ultra HD) + HDR',
    screens: '4',
    downloadDevices: '6',
    hasUhd: true,
    hasSpatial: true,
    hasAds: false,
  },
];

const TABLE_ROWS = [
  {
    label: 'Monthly price',
    type: 'price',
  },
  { label: 'Video quality', key: 'videoQuality', type: 'text' },
  { label: 'Resolution', key: 'resolution', type: 'text' },
  {
    label: 'Spatial audio (immersive sound)',
    key: 'hasSpatial',
    type: 'bool',
  },
  { label: 'Watch on your TV, computer, mobile phone and tablet', key: 'tv', type: 'yes' },
  { label: 'Downloadable devices', key: 'downloadDevices', type: 'text' },
  { label: 'Simultaneous streams', key: 'screens', type: 'text' },
  {
    label: 'Ads',
    key: 'hasAds',
    type: 'ads',
  },
];

function PlanSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('PREMIUM');

  function handleContinue() {
    navigate('/payment', { state: { plan: selected } });
  }

  return (
    <div className="plans-page nf-auth-shell">
      <header className="nf-auth-top">
        <Link to="/" aria-label="Netflix home">
          <img className="brand-logo" src="/Assets/Netflix-brand.png" alt="Netflix" />
        </Link>
      </header>

      <main className="plans-main">
        <p className="nf-step-label plans-step">Step 2 of 3</p>
        <h1 className="nf-flow-title plans-heading">Choose the plan that&apos;s right for you</h1>
        <p className="plans-sub">
          Downgrade or upgrade at any time. We&apos;ll remind you before any price changes.
        </p>

        <div className="plans-grid" role="radiogroup" aria-label="Select membership plan">
          {PLANS.map((plan) => {
            const isSel = selected === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                role="radio"
                aria-checked={isSel}
                className={`plan-pick-card ${isSel ? 'plan-pick-card--selected' : ''}`}
                onClick={() => setSelected(plan.id)}
              >
                <span className="plan-pick-name">{plan.name}</span>
                <span className="plan-pick-price">
                  {plan.price}
                  <span className="plan-pick-period">{plan.period}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="plans-table-wrap" tabIndex={0}>
          <table className="plans-compare">
            <thead>
              <tr>
                <th scope="col" className="plans-th-feature">
                  {' '}
                </th>
                {PLANS.map((plan) => (
                  <th
                    key={plan.id}
                    scope="col"
                    className={selected === plan.id ? 'plans-th--active' : ''}
                  >
                    <button
                      type="button"
                      className="plans-th-btn"
                      onClick={() => setSelected(plan.id)}
                    >
                      {plan.name}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="plans-row-label">
                    {row.label}
                  </th>
                  {PLANS.map((plan) => {
                    let cell;
                    if (row.type === 'price') {
                      cell = (
                        <span className="plans-price-cell">
                          {plan.price}
                          <span className="plan-pick-period">{plan.period}</span>
                        </span>
                      );
                    } else if (row.type === 'text') {
                      cell = plan[row.key];
                    } else if (row.type === 'bool') {
                      cell =
                        plan[row.key] ? (
                          <i className="bi bi-check-lg plans-check" aria-label="Yes" />
                        ) : (
                          <span className="plans-dash">—</span>
                        );
                    } else if (row.type === 'yes') {
                      cell = <i className="bi bi-check-lg plans-check" aria-label="Included" />;
                    } else if (row.type === 'ads') {
                      cell = plan.hasAds ? 'Some ad breaks' : 'No ads';
                    } else {
                      cell = '—';
                    }
                    return (
                      <td
                        key={plan.id}
                        className={selected === plan.id ? 'plans-td--active' : ''}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <th scope="row" className="plans-row-label">
                  4K + HDR
                </th>
                {PLANS.map((plan) => (
                  <td
                    key={plan.id}
                    className={selected === plan.id ? 'plans-td--active' : ''}
                  >
                    {plan.hasUhd ? (
                      <i className="bi bi-check-lg plans-check" aria-label="Included" />
                    ) : (
                      <span className="plans-dash">—</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="plans-next-wrap">
          <button type="button" className="btn nf-btn-primary plans-next-btn" onClick={handleContinue}>
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default PlanSelection;
