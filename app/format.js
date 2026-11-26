// Small formatting helpers: money and dates, kept in one place so every view
// spells the same figure the same way.

const moneyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function money(amount) {
  return moneyFmt.format(amount);
}

export function money0(amount) {
  return moneyFmt.format(amount).replace(/\.00$/, '');
}

export function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

// '2026-11-14' -> 'Sat 14 Nov'
export function shortDate(iso) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

// Escape text that came from a form field before it goes into HTML.
export function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
