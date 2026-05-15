import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', to: '/browse' },
  { label: 'TV Shows', to: '/browse?genre=TV+Show' },
  { label: 'Movies', to: '/browse?genre=Movie' },
  { label: 'New & Popular', to: '/browse?sort=new' },
  { label: 'My List', to: '/browse?mylist=1' },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  }

  return (
    <nav
      className="navbar px-3 px-md-5 py-2 position-sticky top-0"
      style={{ background: '#141414', zIndex: 1000 }}
    >
      <div className="d-flex align-items-center gap-4 flex-grow-1">
        {/* Logo */}
        <Link to="/browse" className="text-decoration-none text-danger fw-bold fs-4 me-2" style={{ letterSpacing: -1 }}>
          NETFLIXFORGED
        </Link>

        {/* Desktop nav links */}
        <div className="d-none d-md-flex gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-decoration-none text-secondary small"
              style={{ transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.target.style.color = 'white')}
              onMouseLeave={(e) => (e.target.style.color = '')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <div className="d-md-none ms-2 position-relative">
          <button
            className="btn btn-sm btn-outline-secondary py-1 px-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰ Browse
          </button>
          {menuOpen && (
            <div
              className="position-absolute top-100 start-0 mt-1 p-2 rounded"
              style={{ background: '#000', border: '1px solid #333', minWidth: 160, zIndex: 200 }}
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="d-block text-decoration-none text-secondary py-2 px-3 small"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="d-flex align-items-center gap-3">
        {/* Search */}
        {searchOpen ? (
          <form onSubmit={handleSearch} className="d-flex gap-1">
            <input
              autoFocus
              className="form-control form-control-sm bg-dark text-white border-secondary"
              placeholder="Titles, genres…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 200 }}
            />
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setSearchOpen(false)}>✕</button>
          </form>
        ) : (
          <button className="btn btn-sm btn-link text-white p-0" onClick={() => setSearchOpen(true)} aria-label="Search">
            🔍
          </button>
        )}

        {/* Notifications (placeholder) */}
        <button className="btn btn-sm btn-link text-white p-0" aria-label="Notifications">
          🔔
        </button>

        {/* User menu */}
        <div className="position-relative">
          <button
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            onClick={() => setMenuOpen(false) || setSearchOpen(false)}
          >
            <span>👤</span>
            <span className="d-none d-md-inline small">{user?.email?.split('@')[0]}</span>
            <span className="small">▾</span>
          </button>
        </div>

        <div className="d-flex gap-2">
          <Link to="/profiles" className="btn btn-sm btn-outline-light">Manage Profiles</Link>
          <button className="btn btn-sm btn-outline-danger" onClick={() => navigate('/logout')}>Sign Out</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
