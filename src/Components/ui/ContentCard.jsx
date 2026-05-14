import { useState, useRef } from 'react';

/**
 * Netflix-style content card.
 * On hover it expands in place, revealing description, genre, cast, and
 * Add-to-List / Play controls. Uses CSS transforms so the card doesn't
 * disturb surrounding layout while enlarged.
 */
function ContentCard({ video, onAddToList, onRemoveFromList, isInList }) {
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef(null);

  function handleMouseEnter() {
    timerRef.current = setTimeout(() => setHovered(true), 300);
  }

  function handleMouseLeave() {
    clearTimeout(timerRef.current);
    setHovered(false);
  }

  if (!video) return null;

  const { title, genre, cast, description } = video;
  const thumbBg = stringToColor(title);

  return (
    <div
      className="position-relative"
      style={{ width: 180, flexShrink: 0, zIndex: hovered ? 50 : 'auto' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail */}
      <div
        className="rounded overflow-hidden"
        style={{
          width: 180,
          height: 100,
          background: thumbBg,
          display: 'flex',
          alignItems: 'flex-end',
          padding: 8,
          cursor: 'pointer',
        }}
      >
        <span
          className="text-white fw-semibold"
          style={{ fontSize: 13, lineHeight: 1.2, textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
        >
          {title}
        </span>
      </div>

      {/* Expanded preview card */}
      {hovered && (
        <div
          className="position-absolute rounded shadow-lg"
          style={{
            top: 0,
            left: '50%',
            transform: 'translateX(-50%) scale(1.35)',
            transformOrigin: 'top center',
            width: 240,
            background: '#181818',
            color: 'white',
            zIndex: 100,
            border: '1px solid #333',
          }}
        >
          {/* Thumbnail top */}
          <div
            className="rounded-top"
            style={{ width: '100%', height: 130, background: thumbBg, position: 'relative' }}
          >
            <div
              className="position-absolute bottom-0 start-0 end-0 p-2"
              style={{ background: 'linear-gradient(to top, #181818, transparent)' }}
            >
              <span className="fw-semibold" style={{ fontSize: 13, lineHeight: 1.2 }}>{title}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="d-flex align-items-center gap-2 px-3 pt-2 pb-1">
            <button
              className="btn btn-light btn-sm rounded-circle fw-bold"
              style={{ width: 32, height: 32 }}
              title="Play"
            >
              ▶
            </button>
            <button
              className="btn btn-outline-light btn-sm rounded-circle"
              style={{ width: 32, height: 32 }}
              title={isInList ? 'Remove from My List' : 'Add to My List'}
              onClick={() => isInList ? onRemoveFromList?.(video) : onAddToList?.(video)}
            >
              {isInList ? '✓' : '+'}
            </button>
            <button
              className="btn btn-outline-secondary btn-sm rounded-circle ms-auto"
              style={{ width: 32, height: 32 }}
              title="More info"
            >
              ⌄
            </button>
          </div>

          {/* Meta */}
          <div className="px-3 pb-3" style={{ fontSize: 12 }}>
            {genre && (
              <span className="badge me-1 mb-1" style={{ background: '#444', color: '#ccc' }}>
                {genre}
              </span>
            )}
            {description && (
              <p className="text-secondary mb-1 mt-1" style={{ fontSize: 11, lineHeight: 1.4 }}>
                {description.length > 80 ? description.slice(0, 80) + '…' : description}
              </p>
            )}
            {cast && (
              <p className="mb-0" style={{ fontSize: 11, color: '#aaa' }}>
                <span className="text-secondary">Cast: </span>{cast.split(',').slice(0, 3).join(', ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Deterministic pastel-ish color from a string, for thumbnail backgrounds. */
function stringToColor(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 40%, 25%)`;
}

export default ContentCard;
