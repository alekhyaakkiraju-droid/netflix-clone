import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { videoService } from '../services/videoService';
import { watchlistService } from '../services/watchlistService';
import { profileService } from '../services/profileService';

function VideoCard({ video, onToggleList, inList }) {
  return (
    <div
      className="card bg-dark text-white border-0 me-2"
      style={{ width: 180, cursor: 'pointer', flexShrink: 0 }}
    >
      <div
        className="card-img-top d-flex align-items-center justify-content-center"
        style={{ height: 100, background: '#333', fontSize: 32 }}
      >
        🎬
      </div>
      <div className="card-body p-2">
        <p className="card-title small fw-bold mb-1 text-truncate">{video.title}</p>
        <p className="text-secondary" style={{ fontSize: 11 }}>{video.genre}</p>
        <button
          className={`btn btn-sm w-100 ${inList ? 'btn-outline-light' : 'btn-outline-danger'}`}
          onClick={() => onToggleList(video.title, inList)}
        >
          {inList ? '✓ In List' : '+ My List'}
        </button>
      </div>
    </div>
  );
}

function Browse() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [activeProfile, setActiveProfile] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [vids, profiles] = await Promise.all([
          videoService.suggestions(40),
          profileService.list(),
        ]);
        setVideos(vids);
        if (profiles.length > 0) {
          setActiveProfile(profiles[0]);
          const wl = await watchlistService.get(profiles[0].id);
          setWatchlist(wl.map((item) => item.videoTitle));
        }
      } catch {
        setError('Failed to load content. Please refresh.');
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    try {
      const results = await videoService.search(search);
      setVideos(results);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function toggleList(videoTitle, inList) {
    if (!activeProfile) return;
    try {
      if (inList) {
        await watchlistService.remove(activeProfile.id, videoTitle);
        setWatchlist((prev) => prev.filter((t) => t !== videoTitle));
      } else {
        await watchlistService.add(activeProfile.id, videoTitle);
        setWatchlist((prev) => [...prev, videoTitle]);
      }
    } catch {
      // Silently fail — the button state will reflect actual state on next load
    }
  }

  // Group videos by genre for Netflix-style rows
  const byGenre = videos.reduce((acc, v) => {
    const g = v.genre ?? 'Other';
    if (!acc[g]) acc[g] = [];
    acc[g].push(v);
    return acc;
  }, {});

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh', background: '#141414' }}
      >
        <div className="spinner-border text-danger" />
      </div>
    );
  }

  return (
    <div style={{ background: '#141414', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <nav className="navbar px-4 py-3" style={{ background: '#000' }}>
        <span className="navbar-brand text-danger fw-bold fs-4">NETFLIXFORGED</span>
        <form className="d-flex gap-2" onSubmit={handleSearch}>
          <input
            className="form-control bg-secondary text-white border-0"
            placeholder="Search titles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <button className="btn btn-outline-light btn-sm" type="submit">Search</button>
        </form>
        <span className="text-secondary small">{user?.email}</span>
      </nav>

      {error && <div className="alert alert-danger mx-4 mt-3">{error}</div>}

      {/* Video rows by genre */}
      <div className="px-4 pb-5">
        {Object.entries(byGenre).map(([genre, genreVideos]) => (
          <div key={genre} className="mb-5">
            <h5 className="text-white mb-3">{genre}</h5>
            <div className="d-flex overflow-auto pb-2" style={{ gap: 8 }}>
              {genreVideos.map((v) => (
                <VideoCard
                  key={v.id}
                  video={v}
                  inList={watchlist.includes(v.title)}
                  onToggleList={toggleList}
                />
              ))}
            </div>
          </div>
        ))}
        {videos.length === 0 && !loading && (
          <p className="text-secondary mt-5 text-center">No results found.</p>
        )}
      </div>
    </div>
  );
}

export default Browse;
