// The five pages of Hearth Ledger, each a function returning HTML. All figures
// come from the store, so adding a transaction or changing a budget limit
// updates every page at once. Buttons and forms carry data-action attributes;
// main.js wires them up once, by delegation.

import { HOUSEHOLD, MONTHLY_HISTORY } from './data.js';
import {
  allGoals,
  allTransactions,
  budgetLimit,
  categories,
  categoryOf,
  spentByCategory,
  totals,
} from './store.js';
import { esc, money, money0, pct, shortDate } from './format.js';
import { donutChart, spendBar, trendChart } from './charts.js';

function summaryCards() {
  const t = totals();
  const rate = t.income ? pct(t.savings, t.income) : 0;
  return `<section class="cards" aria-label="November totals">
    <article class="card income"><p class="card-label">Income · November</p>
      <p class="card-figure">${money(t.income)}</p>
      <p class="card-note">Two salaries, one freelance job, cashback</p></article>
    <article class="card spending"><p class="card-label">Spent · November</p>
      <p class="card-figure">${money(t.expenses)}</p>
      <p class="card-note">${allTransactions().filter((x) => x.type === 'expense').length} expenses recorded</p></article>
    <article class="card saving"><p class="card-label">Saved · November</p>
      <p class="card-figure">${money(t.savings)}</p>
      <p class="card-note">${rate}% of income set aside</p></article>
  </section>`;
}

function categoryRows() {
  return categories()
    .map((c) => {
      const spent = spentByCategory(c.id);
      const limit = budgetLimit(c.id);
      return `<li class="cat-row">
        <span class="cat-dot" style="background:${c.color}"></span>
        <span class="cat-name">${c.label}</span>
        <span class="cat-amount">${money(spent)} <span class="muted">of ${money0(limit)}</span></span>
        ${spendBar(spent, limit, c.color)}
        <span class="cat-pct ${spent > limit ? 'over-text' : ''}">${pct(spent, limit)}%</span>
      </li>`;
    })
    .join('');
}

export function dashboard() {
  const recent = allTransactions().slice(0, 6);
  const top = [...categories()]
    .map((c) => ({ ...c, spent: spentByCategory(c.id) }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);
  return `
  <section class="intro">
    <h1>November, at a glance</h1>
    <p>${esc(HOUSEHOLD.members)} · ${esc(HOUSEHOLD.month)} · Rent, groceries, school and
    everything in between, tracked to the dollar. Nothing here leaves your browser:
    edits are saved on this device only.</p>
  </section>
  ${summaryCards()}
  <div class="two-col">
    <section class="panel">
      <h2>Spending by category</h2>
      <ul class="cat-list">${categoryRows()}</ul>
      <p><a class="btn" href="#/budgets">Adjust budgets →</a></p>
    </section>
    <section class="panel">
      <h2>Biggest categories</h2>
      <ol class="top-list">
        ${top.map((c, i) => `<li><strong>${i + 1}. ${c.label}</strong> — ${money(c.spent)} this month.
          ${i === 0 ? 'Rent is fixed; the lever here is groceries.' : ''}</li>`).join('')}
      </ol>
      <h2>Recent activity</h2>
      <ul class="tx-list compact">
        ${recent.map((t) => `<li><span>${shortDate(t.date)}</span><span>${esc(t.description)}</span>
          <span class="${t.type}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</span></li>`).join('')}
      </ul>
      <p><a class="btn" href="#/transactions">All transactions →</a></p>
    </section>
  </div>`;
}

function txRow(t, editing) {
  const cat = categoryOf(t.category);
  if (editing === t.id) {
    return `<li class="tx-edit">
      <form data-action="save-edit" data-id="${t.id}" class="tx-form">
        <label>Date <input type="date" name="date" value="${t.date}" required></label>
        <label>Description <input type="text" name="description" value="${esc(t.description)}" required maxlength="80"></label>
        <label>Category <select name="category">
          ${categories().map((c) => `<option value="${c.id}" ${c.id === t.category ? 'selected' : ''}>${c.label}</option>`).join('')}
          <option value="income" ${t.category === 'income' ? 'selected' : ''}>Income</option>
        </select></label>
        <label>Type <select name="type">
          <option value="expense" ${t.type === 'expense' ? 'selected' : ''}>Expense</option>
          <option value="income" ${t.type === 'income' ? 'selected' : ''}>Income</option>
        </select></label>
        <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" value="${t.amount}" required></label>
        <span class="form-actions"><button class="btn primary" type="submit">Save</button>
        <button class="btn" type="button" data-action="cancel-edit">Cancel</button></span>
      </form>
    </li>`;
  }
  return `<li class="tx-row">
    <span class="tx-date">${shortDate(t.date)}</span>
    <span class="tx-desc">${esc(t.description)}</span>
    <span class="tx-cat"><span class="cat-dot" style="background:${cat.color}"></span>${cat.label}</span>
    <span class="tx-amount ${t.type}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</span>
    <span class="tx-actions">
      <button class="btn small" data-action="edit" data-id="${t.id}">Edit</button>
      <button class="btn small danger" data-action="delete" data-id="${t.id}">Delete</button>
    </span>
  </li>`;
}

export function transactions(filter = 'all', editing = null, search = '') {
  const all = allTransactions();
  const shown = all.filter(
    (t) =>
      (filter === 'all' || t.category === filter || (filter === 'income' && t.type === 'income')) &&
      (!search || t.description.toLowerCase().includes(search.toLowerCase())),
  );
  const spent = shown.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const earned = shown.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  return `
  <h1>Transactions</h1>
  <p class="lede">Every dollar in and out for November 2026. Add, edit or delete anything —
  the dashboard, budgets and reports update straight away.</p>
  <section class="panel">
    <h2>Add a transaction</h2>
    <form data-action="add" class="tx-form">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>Description <input type="text" name="description" placeholder="e.g. GreenMart weekly shop" required maxlength="80"></label>
      <label>Category <select name="category">
        ${categories().map((c) => `<option value="${c.id}">${c.label}</option>`).join('')}
      </select></label>
      <label>Type <select name="type"><option value="expense">Expense</option><option value="income">Income</option></select></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <span class="form-actions"><button class="btn primary" type="submit">Add transaction</button></span>
    </form>
  </section>
  <section class="panel">
    <div class="filter-bar">
      <label>Category
        <select data-action="filter">
          <option value="all" ${filter === 'all' ? 'selected' : ''}>All categories</option>
          <option value="income" ${filter === 'income' ? 'selected' : ''}>Income</option>
          ${categories().map((c) => `<option value="${c.id}" ${filter === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}
        </select>
      </label>
      <label>Search <input type="search" data-action="search" value="${esc(search)}" placeholder="Search descriptions…"></label>
      <p class="filter-totals">Showing ${shown.length} of ${all.length} · spent ${money(spent)} · earned ${money(earned)}</p>
    </div>
    <ul class="tx-list">${shown.map((t) => txRow(t, editing)).join('') || '<li class="muted">Nothing matches — try another filter.</li>'}</ul>
  </section>`;
}

export function budgets() {
  const t = totals();
  const totalLimit = categories().reduce((s, c) => s + budgetLimit(c.id), 0);
  return `
  <h1>Budgets</h1>
  <p class="lede">Monthly limits for November. Change a limit and the progress bars move with
  it. Total planned spending: <strong>${money(totalLimit)}</strong> against
  <strong>${money(t.income)}</strong> income — leaving <strong>${money(t.income - totalLimit)}</strong> unassigned.</p>
  <ul class="budget-list">
    ${categories()
      .map((c) => {
        const spent = spentByCategory(c.id);
        const limit = budgetLimit(c.id);
        const left = limit - spent;
        return `<li class="panel budget-row">
          <div class="budget-head">
            <span class="cat-dot" style="background:${c.color}"></span>
            <h2>${c.label}</h2>
            <span class="budget-figures">${money(spent)} spent · ${money0(limit)} limit</span>
          </div>
          ${spendBar(spent, limit, c.color)}
          <p class="${left < 0 ? 'over-text' : 'muted'}">${left < 0 ? `${money(-left)} over budget` : `${money(left)} left this month`}</p>
          <form data-action="set-limit" data-category="${c.id}" class="limit-form">
            <label>Monthly limit ($) <input type="number" name="limit" min="0" step="1" value="${limit}" required></label>
            <button class="btn small primary" type="submit">Save limit</button>
          </form>
        </li>`;
      })
      .join('')}
  </ul>`;
}

export function goals() {
  const t = totals();
  return `
  <h1>Savings goals</h1>
  <p class="lede">What November's <strong>${money(t.savings)}</strong> of savings is working towards.
  Tap a button to move money into a goal — the bar and the remaining amount update at once.</p>
  <ul class="goal-list">
    ${allGoals()
      .map((g) => {
        const p = pct(g.saved, g.target);
        return `<li class="panel goal-card">
          <h2>${esc(g.name)}</h2>
          <p class="muted">${esc(g.note)}</p>
          <p class="goal-figures"><strong>${money(g.saved)}</strong> of ${money(g.target)} · ${p}%</p>
          ${spendBar(g.saved, g.target, '#2f6f5e')}
          <p class="muted">${money(g.target - g.saved)} to go</p>
          <div class="contribute">
            <span>Contribute:</span>
            <button class="btn small" data-action="contribute" data-id="${g.id}" data-amount="25">+$25</button>
            <button class="btn small" data-action="contribute" data-id="${g.id}" data-amount="50">+$50</button>
            <button class="btn small" data-action="contribute" data-id="${g.id}" data-amount="100">+$100</button>
            <form data-action="contribute-custom" data-id="${g.id}" class="custom-amount">
              <label>$ <input type="number" name="amount" min="1" step="1" placeholder="Custom" required></label>
              <button class="btn small primary" type="submit">Add</button>
            </form>
          </div>
        </li>`;
      })
      .join('')}
  </ul>
  <section class="panel">
    <h2>Start a new goal</h2>
    <form data-action="add-goal" class="tx-form">
      <label>Goal name <input type="text" name="name" placeholder="e.g. New bikes for the kids" required maxlength="60"></label>
      <label>Why it matters <input type="text" name="note" placeholder="A sentence about the goal" maxlength="120"></label>
      <label>Target ($) <input type="number" name="target" min="1" step="1" placeholder="1000" required></label>
      <span class="form-actions"><button class="btn primary" type="submit">Add goal</button></span>
    </form>
  </section>`;
}

export function reports() {
  const t = totals();
  const slices = categories()
    .map((c) => ({ label: c.label, value: spentByCategory(c.id), color: c.color }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
  const history = MONTHLY_HISTORY.map((m) => (m.month === 'Nov' ? { ...m, income: t.income, expenses: t.expenses } : m));
  const avgSpend = Math.round(history.reduce((s, m) => s + m.expenses, 0) / history.length);
  const bestMonth = [...history].sort((a, b) => (b.income - b.expenses) - (a.income - a.expenses))[0];
  const housingShare = pct(spentByCategory('housing'), t.expenses);
  return `
  <h1>Reports</h1>
  <p class="lede">Six months of the household's money, June to November 2026. November's bars
  use the live totals, so they move when you edit a transaction.</p>
  <section class="panel">
    <h2>Income vs spending, by month</h2>
    ${trendChart(history)}
    <p class="legend"><span class="swatch" style="background:#2f6f5e"></span> Income
    <span class="swatch" style="background:#c96f4a"></span> Spending</p>
  </section>
  <div class="two-col">
    <section class="panel">
      <h2>Where November's money went</h2>
      ${donutChart(slices)}
      <ul class="legend-list">
        ${slices.map((s) => `<li><span class="swatch" style="background:${s.color}"></span>${s.label} — ${money(s.value)} (${pct(s.value, t.expenses)}%)</li>`).join('')}
      </ul>
    </section>
    <section class="panel">
      <h2>What the numbers say</h2>
      <ul class="insights">
        <li><strong>Average monthly spending</strong> over the last six months is ${money(avgSpend)}.</li>
        <li><strong>Best saving month</strong> was ${bestMonth.month}, with ${money(bestMonth.income - bestMonth.expenses)} set aside.</li>
        <li><strong>Housing takes ${housingShare}%</strong> of November's spending — the fixed cost everything else works around.</li>
        <li><strong>Groceries are the lever:</strong> November's grocery spend is under its ${money0(budgetLimit('groceries'))} limit for the third month running, freeing about ${money(budgetLimit('groceries') - spentByCategory('groceries'))} for the holiday goal.</li>
        <li><strong>Savings rate:</strong> ${pct(t.savings, t.income)}% of November's income was saved, above the household's 15% target.</li>
      </ul>
      <p><a class="btn" href="#/goals">See the savings goals →</a></p>
    </section>
  </div>`;
}

export function notFound() {
  return `<h1>That page isn't in the ledger</h1>
  <p class="lede">The link may be out of date. The household's pages are:</p>
  <p><a class="btn" href="#/">Back to the dashboard →</a></p>`;
}
