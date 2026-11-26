// Seed data for Hearth Ledger: the Marlowe household's November 2026 budget.
// A fictional family of four (Maya, Tom, and two school-age kids) living in a
// rented three-bedroom flat. Every figure below is invented for the demo, and
// the category totals are the exact sums of the transactions listed here, so
// the dashboard, budgets and reports always agree with each other.

export const HOUSEHOLD = {
  name: 'The Marlowe Household',
  members: 'Maya & Tom, plus Ada (9) and Leo (6)',
  month: 'November 2026',
  currency: 'USD',
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#2f6f5e', limit: 1450 },
  { id: 'groceries', label: 'Groceries', color: '#7a9e43', limit: 650 },
  { id: 'transport', label: 'Transport', color: '#4a7fa5', limit: 320 },
  { id: 'utilities', label: 'Utilities', color: '#c98a2e', limit: 300 },
  { id: 'dining', label: 'Dining out', color: '#b4552d', limit: 250 },
  { id: 'entertainment', label: 'Entertainment', color: '#7d5ba6', limit: 180 },
  { id: 'health', label: 'Health', color: '#3d8b7a', limit: 160 },
  { id: 'kids', label: 'Kids & school', color: '#d1607a', limit: 340 },
  { id: 'clothing', label: 'Clothing', color: '#5b7d8a', limit: 120 },
  { id: 'home', label: 'Home & garden', color: '#8a6d3b', limit: 150 },
  { id: 'personal', label: 'Personal', color: '#9a6fb0', limit: 140 },
  { id: 'misc', label: 'Miscellaneous', color: '#8c8c8c', limit: 100 },
];

// type: 'expense' | 'income'. Amounts in dollars.
export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', description: 'Payday — Maya (design studio)', category: 'income', type: 'income', amount: 2600 },
  { id: 't02', date: '2026-11-01', description: 'Monthly rent', category: 'housing', type: 'expense', amount: 1450 },
  { id: 't03', date: '2026-11-02', description: 'School lunch top-up — Ada & Leo', category: 'kids', type: 'expense', amount: 80 },
  { id: 't04', date: '2026-11-02', description: 'GreenMart weekly shop', category: 'groceries', type: 'expense', amount: 148.2 },
  { id: 't05', date: '2026-11-03', description: 'Fuel — family car', category: 'transport', type: 'expense', amount: 52 },
  { id: 't06', date: '2026-11-03', description: 'Bank account fee', category: 'misc', type: 'expense', amount: 12 },
  { id: 't07', date: '2026-11-04', description: 'Noodle house — family dinner', category: 'dining', type: 'expense', amount: 38.5 },
  { id: 't08', date: '2026-11-05', description: 'Electricity bill', category: 'utilities', type: 'expense', amount: 96.4 },
  { id: 't09', date: '2026-11-05', description: 'Haircut — Tom', category: 'personal', type: 'expense', amount: 42 },
  { id: 't10', date: '2026-11-06', description: 'Cinema — Saturday matinee', category: 'entertainment', type: 'expense', amount: 34 },
  { id: 't11', date: '2026-11-07', description: 'Pharmacy — cold medicine', category: 'health', type: 'expense', amount: 28.75 },
  { id: 't12', date: '2026-11-07', description: 'Farmers market vegetables', category: 'groceries', type: 'expense', amount: 42.5 },
  { id: 't13', date: '2026-11-08', description: 'Water bill', category: 'utilities', type: 'expense', amount: 41.2 },
  { id: 't14', date: '2026-11-08', description: 'Light bulbs & toolbox bits', category: 'home', type: 'expense', amount: 36.2 },
  { id: 't15', date: '2026-11-09', description: 'GreenMart weekly shop', category: 'groceries', type: 'expense', amount: 121.75 },
  { id: 't16', date: '2026-11-09', description: 'Streaming subscription', category: 'entertainment', type: 'expense', amount: 15.99 },
  { id: 't17', date: '2026-11-10', description: 'Metro card top-up', category: 'transport', type: 'expense', amount: 60 },
  { id: 't18', date: '2026-11-10', description: 'Piano lessons — Ada', category: 'kids', type: 'expense', amount: 120 },
  { id: 't19', date: '2026-11-11', description: 'Internet & phone', category: 'utilities', type: 'expense', amount: 79 },
  { id: 't20', date: '2026-11-12', description: 'Dentist check-up — Leo', category: 'health', type: 'expense', amount: 65 },
  { id: 't21', date: '2026-11-12', description: 'Fuel — family car', category: 'transport', type: 'expense', amount: 48.5 },
  { id: 't22', date: '2026-11-12', description: 'Books — Maya', category: 'personal', type: 'expense', amount: 28.9 },
  { id: 't23', date: '2026-11-13', description: 'Pizza night', category: 'dining', type: 'expense', amount: 46.8 },
  { id: 't24', date: '2026-11-14', description: 'Corner grocer top-up', category: 'groceries', type: 'expense', amount: 68.4 },
  { id: 't25', date: '2026-11-14', description: 'Winter coat — Ada', category: 'clothing', type: 'expense', amount: 88 },
  { id: 't26', date: '2026-11-15', description: 'Payday — Tom (school caretaker)', category: 'income', type: 'income', amount: 1900 },
  { id: 't27', date: '2026-11-15', description: 'Board game — family night', category: 'entertainment', type: 'expense', amount: 42 },
  { id: 't28', date: '2026-11-16', description: 'Café brunch', category: 'dining', type: 'expense', amount: 32.4 },
  { id: 't29', date: '2026-11-17', description: 'Stationery & printer paper', category: 'misc', type: 'expense', amount: 18.45 },
  { id: 't30', date: '2026-11-17', description: 'Kids’ shoes — Leo', category: 'kids', type: 'expense', amount: 64.5 },
  { id: 't31', date: '2026-11-18', description: 'GreenMart weekly shop', category: 'groceries', type: 'expense', amount: 132.1 },
  { id: 't32', date: '2026-11-18', description: 'Gym membership', category: 'health', type: 'expense', amount: 48 },
  { id: 't33', date: '2026-11-19', description: 'Parking — hospital visit', category: 'transport', type: 'expense', amount: 18 },
  { id: 't34', date: '2026-11-19', description: 'Plant pots & soil', category: 'home', type: 'expense', amount: 24.8 },
  { id: 't35', date: '2026-11-20', description: 'Gas bill', category: 'utilities', type: 'expense', amount: 57.6 },
  { id: 't36', date: '2026-11-21', description: 'Sushi — date night', category: 'dining', type: 'expense', amount: 58.9 },
  { id: 't37', date: '2026-11-21', description: 'Fuel — family car', category: 'transport', type: 'expense', amount: 55.25 },
  { id: 't38', date: '2026-11-22', description: 'Bulk pantry — rice & oats', category: 'groceries', type: 'expense', amount: 58.9 },
  { id: 't39', date: '2026-11-22', description: 'Birthday gift for Aunt Rosa', category: 'personal', type: 'expense', amount: 50 },
  { id: 't40', date: '2026-11-23', description: 'Concert tickets — school fundraiser', category: 'entertainment', type: 'expense', amount: 72 },
  { id: 't41', date: '2026-11-24', description: 'School trip — Ada', category: 'kids', type: 'expense', amount: 40 },
  { id: 't42', date: '2026-11-24', description: 'Ride share — late train home', category: 'transport', type: 'expense', amount: 22.4 },
  { id: 't43', date: '2026-11-25', description: 'Thai takeaway', category: 'dining', type: 'expense', amount: 29.9 },
  { id: 't44', date: '2026-11-25', description: 'Donation — food bank', category: 'misc', type: 'expense', amount: 34 },
  { id: 't45', date: '2026-11-26', description: 'GreenMart weekly shop', category: 'groceries', type: 'expense', amount: 40.15 },
  { id: 't46', date: '2026-11-26', description: 'Cleaning supplies', category: 'home', type: 'expense', amount: 35.1 },
  { id: 't47', date: '2026-11-27', description: 'Metro card top-up', category: 'transport', type: 'expense', amount: 42 },
  { id: 't48', date: '2026-11-27', description: 'Freelance design — Maya (logo job)', category: 'income', type: 'income', amount: 220 },
  { id: 't49', date: '2026-11-28', description: 'Bakery lunch', category: 'dining', type: 'expense', amount: 24.6 },
  { id: 't50', date: '2026-11-28', description: 'Cashback & interest', category: 'income', type: 'income', amount: 100 },
];

export const GOALS = [
  { id: 'g1', name: 'Emergency fund', note: 'Three months of essentials, for peace of mind.', target: 6000, saved: 4150 },
  { id: 'g2', name: 'Family holiday — coast trip', note: 'A week by the sea next summer, train tickets included.', target: 2400, saved: 1275 },
  { id: 'g3', name: 'New washing machine', note: 'The old one rattles on spin cycle. Replace before it gives up.', target: 850, saved: 620 },
  { id: 'g4', name: 'Kids’ college starter', note: 'A little each month, started when Leo was born.', target: 5000, saved: 1900 },
];

// Six months of totals for the trend chart (June–November 2026).
export const MONTHLY_HISTORY = [
  { month: 'Jun', income: 4780, expenses: 3710 },
  { month: 'Jul', income: 4820, expenses: 3980 },
  { month: 'Aug', income: 4790, expenses: 3655 },
  { month: 'Sep', income: 4850, expenses: 3890 },
  { month: 'Oct', income: 4820, expenses: 3920 },
  { month: 'Nov', income: 4820, expenses: 3845.14 },
];
