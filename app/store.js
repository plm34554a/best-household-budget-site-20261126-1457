// The household's ledger: loads the seed data, keeps every change in
// localStorage, and answers the totals every view needs. Editing here (add,
// edit, delete, change a budget limit, add to a goal) updates the stored
// state, and the next page load reads it back; clearing the browser's stored
// data brings the November seed back.

import { CATEGORIES, GOALS, TRANSACTIONS } from './data.js';

const KEY = 'hearth-ledger-v1';

function seed() {
  return {
    transactions: TRANSACTIONS.map((t) => ({ ...t })),
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.limit])),
    goals: GOALS.map((g) => ({ ...g })),
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || !parsed.budgets || !Array.isArray(parsed.goals)) return seed();
    return parsed;
  } catch {
    return seed();
  }
}

let state = load();

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable: the page still works for this visit.
  }
}

export function resetToSeed() {
  state = seed();
  save();
}

export function allTransactions() {
  return [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function transactionsByCategory(categoryId) {
  return allTransactions().filter((t) => t.category === categoryId);
}

export function addTransaction(tx) {
  const id = `u${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
  state.transactions.push({ id, ...tx });
  save();
  return id;
}

export function updateTransaction(id, patch) {
  const found = state.transactions.find((t) => t.id === id);
  if (!found) return false;
  Object.assign(found, patch);
  save();
  return true;
}

export function deleteTransaction(id) {
  const before = state.transactions.length;
  state.transactions = state.transactions.filter((t) => t.id !== id);
  if (state.transactions.length === before) return false;
  save();
  return true;
}

export function categoryOf(id) {
  return CATEGORIES.find((c) => c.id === id) ?? { id, label: id, color: '#8c8c8c' };
}

export function categories() {
  return CATEGORIES;
}

export function budgetLimit(categoryId) {
  return state.budgets[categoryId] ?? 0;
}

export function setBudgetLimit(categoryId, limit) {
  state.budgets[categoryId] = Math.max(0, Math.round(limit * 100) / 100);
  save();
}

export function spentByCategory(categoryId) {
  return round2(
    state.transactions
      .filter((t) => t.type === 'expense' && t.category === categoryId)
      .reduce((sum, t) => sum + t.amount, 0),
  );
}

export function totals() {
  const income = round2(sumWhere('income'));
  const expenses = round2(sumWhere('expense'));
  return { income, expenses, savings: round2(income - expenses) };
}

function sumWhere(type) {
  return state.transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);
}

export function round2(n) {
  return Math.round(n * 100) / 100;
}

export function allGoals() {
  return state.goals;
}

export function contributeToGoal(id, amount) {
  const goal = state.goals.find((g) => g.id === id);
  if (!goal || amount <= 0) return false;
  goal.saved = round2(Math.min(goal.target, goal.saved + amount));
  save();
  return true;
}

export function addGoal(goal) {
  const id = `g${Date.now().toString(36)}`;
  state.goals.push({ id, saved: 0, ...goal });
  save();
  return id;
}
