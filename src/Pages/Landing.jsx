import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQ_ITEMS = [
  {
    q: 'What is NetflixForged?',
    a: 'NetflixForged is a streaming platform where you can enjoy unlimited movies and TV shows at an affordable price.',
  },
  {
    q: 'How much does NetflixForged cost?',
    a: 'Watch NetflixForged on your smartphone, tablet, laptop, and TV for one low price. Plans start at $6.99/month.',
  },
  {
    q: 'Where can I watch?',
    a: 'Watch anywhere, anytime. Sign in with your NetflixForged account to watch instantly on the web or on any device.',
  },
  {
    q: 'How do I cancel?',
    a: 'NetflixForged is flexible. There are no cancellations fees and no contracts. You can easily cancel online in two clicks.',
  },
  {
    q: 'What can I watch on NetflixForged?',
    a: 'NetflixForged has an extensive library of feature films, documentaries, TV shows, anime, award-winning originals, and more.',
  },
  {
    q: 'Is NetflixForged good for kids?',
    a: 'The NetflixForged Kids experience is included in your membership to give parents control while kids enjoy family-friendly content.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-2">
      <button
        className="w-100 text-start py-4 px-5 d-flex justify-content-between align-items-center border-0"
        style={{ background: '#303030', color: 'white', fontSize: 20 }}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <span style={{ fontSize: 28, transform: open ? 'rotate(45deg)' : 'none', transition: '0.3s' }}>+</span>
      </button>
      {open && (
        <div className="py-4 px-5" style={{ background: '#303030', color: 'white', fontSize: 18, marginTop: 2 }}>
          {a}
        </div>
      )}
    </div>
  );
}

function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  function handleGetStarted(e) {
    e.preventDefault();
    navigate('/registration', { state: { email } });
  }

  return (
    <div style={{ background: '#000', color: 'white', fontFamily: 'Netflix Sans, sans-serif' }}>
      {/* Hero section */}
      <div
        className="position-relative text-center py-5"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(/hero-bg.jpg) center/cover',
          borderBottom: '8px solid #222',
        }}
      >
        <nav className="d-flex justify-content-between align-items-center px-5 py-3 position-absolute top-0 start-0 end-0">
          <span className="text-danger fw-bold" style={{ fontSize: 32, letterSpacing: -1 }}>NETFLIXFORGED</span>
          <button className="btn btn-danger px-3 py-2 fw-bold" onClick={() => navigate('/login')}>Sign In</button>
        </nav>

        <div className="pt-5 mt-5 pb-4">
          <h1 className="display-4 fw-bold mb-3 mt-5">Unlimited movies, TV shows, and more.</h1>
          <h2 className="fs-4 fw-normal mb-4">Watch anywhere. Cancel anytime.</h2>
          <p className="mb-4 fs-5">Ready to watch? Enter your email to create or restart your membership.</p>
          <form className="d-flex justify-content-center gap-2 flex-wrap" onSubmit={handleGetStarted}>
            <input
              type="email"
              className="form-control"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ maxWidth: 380, height: 54 }}
              required
            />
            <button type="submit" className="btn btn-danger btn-lg px-4 fw-bold" style={{ height: 54 }}>
              Get Started &rsaquo;
            </button>
          </form>
        </div>
      </div>

      {/* Feature rows */}
      <section className="py-5 border-top border-secondary" style={{ borderTopColor: '#222 !important' }}>
        <div className="container">
          <div className="row align-items-center py-4">
            <div className="col-12 col-md-6">
              <h2 className="display-5 fw-bold mb-3">Enjoy on your TV.</h2>
              <p className="fs-5 text-secondary">Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
            </div>
            <div className="col-12 col-md-6 text-center fs-1">📺</div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: '#000', borderTop: '8px solid #222' }}>
        <div className="container">
          <div className="row align-items-center py-4 flex-row-reverse">
            <div className="col-12 col-md-6">
              <h2 className="display-5 fw-bold mb-3">Download your shows to watch offline.</h2>
              <p className="fs-5 text-secondary">Save your favorites easily and always have something to watch.</p>
            </div>
            <div className="col-12 col-md-6 text-center fs-1">📱</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-5" style={{ borderTop: '8px solid #222' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="text-center display-5 fw-bold mb-4">Frequently Asked Questions</h2>
          {FAQ_ITEMS.map((item) => <FaqItem key={item.q} {...item} />)}
          <div className="text-center mt-5">
            <p className="fs-5 mb-3">Ready to watch? Enter your email to create or restart your membership.</p>
            <form className="d-flex justify-content-center gap-2 flex-wrap" onSubmit={handleGetStarted}>
              <input
                type="email"
                className="form-control"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ maxWidth: 380, height: 54 }}
                required
              />
              <button type="submit" className="btn btn-danger btn-lg px-4 fw-bold" style={{ height: 54 }}>
                Get Started &rsaquo;
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
