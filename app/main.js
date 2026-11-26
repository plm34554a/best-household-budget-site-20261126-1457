// Hearth Ledger: a household budget site on hash routes. One render function
// per route, one delegated click/submit handler for every control, and a
// __shotReady flag so a screenshot script knows when the page is on screen.
//
//   #/                Dashboard
//   #/transactions    Full list, add / edit / delete, filter and search
//   #/budgets         Monthly limits with progress bars
//   #/goals           Savings goals with contributions
//   #/reports         Six-month trend and category breakdown
//
// State lives in the store (localStorage, seeded from data.js); re-rendering
// after any change is what keeps every page's figures in agreement.

import {
  addGoal,
  addTransaction,
  contributeToGoal,
  deleteTransaction,
  resetToSeed,
  setBudgetLimit,
  updateTransaction,
} from './store.js';
import { budgets, dashboard, goals, notFound, reports, transactions } from './views.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('nav a')];

// View-local UI state that should survive a re-render of the same page.
const ui = { filter: 'all', search: '', editing: null };

function route() {
  const hash = location.hash || '#/';
  if (hash === '#/' || hash === '#') return 'dashboard';
  const name = hash.replace(/^#\//, '').split('/')[0];
  return ['transactions', 'budgets', 'goals', 'reports'].includes(name) ? name : 'missing';
}

function render() {
  window.__shotReady = false;
  const page = route();
  document.title =
    page === 'dashboard'
      ? 'Hearth Ledger — Household Budget'
      : `${page[0].toUpperCase() + page.slice(1)} · Hearth Ledger`;
  app.innerHTML =
    page === 'dashboard'
      ? dashboard()
      : page === 'transactions'
        ? transactions(ui.filter, ui.editing, ui.search)
        : page === 'budgets'
          ? budgets()
          : page === 'goals'
            ? goals()
            : page === 'reports'
              ? reports()
              : notFound();
  for (const link of navLinks) {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#/${page === 'dashboard' ? '' : page}` || (page === 'dashboard' && href === '#/'));
    link.setAttribute('aria-current', link.classList.contains('active') ? 'page' : 'false');
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

app.addEventListener('submit', (event) => {
  const form = event.target.closest('form[data-action]');
  if (!form) return;
  event.preventDefault();
  const action = form.dataset.action;
  const data = formData(form);
  if (action === 'add') {
    addTransaction({
      date: data.date,
      description: data.description.trim(),
      category: data.type === 'income' ? 'income' : data.category,
      type: data.type,
      amount: Number(data.amount),
    });
    form.reset();
    form.querySelector('[name="date"]').value = '2026-11-26';
  } else if (action === 'save-edit') {
    updateTransaction(form.dataset.id, {
      date: data.date,
      description: data.description.trim(),
      category: data.type === 'income' ? 'income' : data.category,
      type: data.type,
      amount: Number(data.amount),
    });
    ui.editing = null;
  } else if (action === 'set-limit') {
    setBudgetLimit(form.dataset.category, Number(data.limit));
  } else if (action === 'contribute-custom') {
    contributeToGoal(form.dataset.id, Number(data.amount));
    form.reset();
  } else if (action === 'add-goal') {
    addGoal({ name: data.name.trim(), note: data.note.trim(), target: Number(data.target) });
    form.reset();
  }
  render();
});

app.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'edit') {
    ui.editing = button.dataset.id;
    render();
  } else if (action === 'cancel-edit') {
    ui.editing = null;
    render();
  } else if (action === 'delete') {
    const row = button.closest('.tx-row');
    const label = row ? row.querySelector('.tx-desc')?.textContent : 'this transaction';
    if (window.confirm(`Delete “${label}”? This cannot be undone.`)) {
      deleteTransaction(button.dataset.id);
      render();
    }
  } else if (action === 'contribute') {
    contributeToGoal(button.dataset.id, Number(button.dataset.amount));
    render();
  }
});

app.addEventListener('change', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  if (el.dataset.action === 'filter') {
    ui.filter = el.value;
    render();
  }
});

app.addEventListener('input', (event) => {
  const el = event.target.closest('[data-action="search"]');
  if (!el) return;
  ui.search = el.value;
  // Re-render only the list totals and rows, keeping focus in the search box.
  const caret = el.selectionStart;
  render();
  const again = app.querySelector('[data-action="search"]');
  if (again) {
    again.focus();
    again.setSelectionRange(caret, caret);
  }
});

document.getElementById('reset-demo')?.addEventListener('click', () => {
  if (window.confirm('Restore the November seed data? Your edits will be lost.')) {
    resetToSeed();
    ui.filter = 'all';
    ui.search = '';
    ui.editing = null;
    render();
  }
});

window.addEventListener('hashchange', () => {
  ui.editing = null;
  render();
});

render();
