// Hand-drawn SVG charts, no library: a grouped bar chart for the monthly
// trend and a donut for the category breakdown. Both are pure functions of
// the numbers they are given, so the reports page can re-render them from
// the live totals after an edit.

import { money0 } from './format.js';

// Grouped bars: income (green) next to expenses (terracotta) for each month.
// width/height are the SVG viewBox; the chart scales to its container.
export function trendChart(months, { width = 640, height = 300 } = {}) {
  const padL = 52;
  const padB = 28;
  const padT = 14;
  const max = Math.max(...months.flatMap((m) => [m.income, m.expenses])) * 1.08;
  const innerW = width - padL - 8;
  const innerH = height - padT - padB;
  const slot = innerW / months.length;
  const barW = Math.min(26, slot / 3);
  const y = (v) => padT + innerH - (v / max) * innerH;
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const gv = max * f;
    const gy = y(gv);
    return `<line x1="${padL}" y1="${gy}" x2="${width - 8}" y2="${gy}" stroke="#e3ddd2" stroke-width="1"/>
      <text x="${padL - 8}" y="${gy + 4}" text-anchor="end" font-size="11" fill="#6b655a">${money0(Math.round(gv))}</text>`;
  }).join('');
  const bars = months
    .map((m, i) => {
      const cx = padL + slot * i + slot / 2;
      return `<rect x="${cx - barW - 3}" y="${y(m.income)}" width="${barW}" height="${innerH - (y(m.income) - padT)}" rx="3" fill="#2f6f5e">
        <title>${m.month} income ${money0(m.income)}</title></rect>
      <rect x="${cx + 3}" y="${y(m.expenses)}" width="${barW}" height="${innerH - (y(m.expenses) - padT)}" rx="3" fill="#c96f4a">
        <title>${m.month} expenses ${money0(m.expenses)}</title></rect>
      <text x="${cx}" y="${height - 8}" text-anchor="middle" font-size="12" fill="#3d3a33">${m.month}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Monthly income and expenses, June to November 2026" class="chart">
    ${grid}
    <line x1="${padL}" y1="${padT + innerH}" x2="${width - 8}" y2="${padT + innerH}" stroke="#b9b2a4" stroke-width="1"/>
    ${bars}
  </svg>`;
}

// Donut: one arc per category, with a hole in the middle for the total.
export function donutChart(slices, { size = 260, thickness = 42 } = {}) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (!total) return '<p class="muted">No spending recorded yet.</p>';
  const r = size / 2;
  const inner = r - thickness;
  const cx = r;
  const cy = r;
  let angle = -Math.PI / 2;
  const paths = slices
    .map((s) => {
      const frac = s.value / total;
      const a0 = angle;
      const a1 = angle + frac * Math.PI * 2;
      angle = a1;
      const large = frac > 0.5 ? 1 : 0;
      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const xi1 = cx + inner * Math.cos(a1);
      const yi1 = cy + inner * Math.sin(a1);
      const xi0 = cx + inner * Math.cos(a0);
      const yi0 = cy + inner * Math.sin(a0);
      return `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}
        L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${s.color}">
        <title>${s.label}: ${money0(s.value)}</title></path>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category" class="donut">
    ${paths}
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="13" fill="#6b655a">Total spent</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="19" font-weight="700" fill="#2b2823">${money0(total)}</text>
  </svg>`;
}

// Horizontal bars for one row of category spending, used on the dashboard.
export function spendBar(spent, limit, color) {
  const ratio = limit ? Math.min(spent / limit, 1) : 0;
  const over = limit ? spent > limit : false;
  return `<div class="bar-track" role="img" aria-label="${money0(spent)} of ${money0(limit)}">
    <div class="bar-fill ${over ? 'over' : ''}" style="width:${Math.round(ratio * 100)}%;background:${color}"></div>
  </div>`;
}
