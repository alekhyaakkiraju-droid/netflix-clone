/**
 * Deterministic gradient used when no thumbnail asset/CSS is available.
 */
export function gradientForTitle(title) {
  const t = typeof title === 'string' ? title : '';
  let hash = 0;
  for (let i = 0; i < t.length; i += 1) {
    hash = t.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash);
  const hue1 = h % 360;
  const hue2 = (h >> 8) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 55%, 32%) 0%, hsl(${hue2}, 48%, 20%) 100%)`;
}
