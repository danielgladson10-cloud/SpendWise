/**
 * SpendWise — Interactive Expense & Budget Visualizer
 * Core Application Engine & State Controller
 */

// =============================================================================
// 1. CONSTANTS & INITIAL CONFIGURATION
// =============================================================================

const STORAGE_KEYS = {
  TRANSACTIONS: 'spendwise_transactions_v1',
  BUDGETS: 'spendwise_budgets_v1'
};

const EXPENSE_CATEGORIES = [
  'Housing',
  'Food & Dining',
  'Utilities',
  'Entertainment',
  'Transportation',
  'Shopping',
  'Healthcare',
  'Other'
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance & Consulting',
  'Investments & Dividends',
  'Side Hustle',
  'Gift & Bonus',
  'Other Income'
];

const CATEGORY_COLORS = {
  'Housing': '#6366f1',         // Indigo
  'Food & Dining': '#f59e0b',   // Amber
  'Utilities': '#06b6d4',       // Cyan
  'Entertainment': '#ec4899',   // Pink
  'Transportation': '#8b5cf6',  // Purple
  'Shopping': '#3b82f6',        // Blue
  'Healthcare': '#10b981',      // Emerald
  'Other': '#64748b',           // Slate
  'Salary': '#10b981',
  'Freelance & Consulting': '#059669',
  'Investments & Dividends': '#047857',
  'Side Hustle': '#34d399',
  'Gift & Bonus': '#6ee7b7',
  'Other Income': '#a7f3d0'
};

const CATEGORY_ICONS = {
  'Housing': 'home',
  'Food & Dining': 'utensils',
  'Utilities': 'zap',
  'Entertainment': 'film',
  'Transportation': 'car',
  'Shopping': 'shopping-bag',
  'Healthcare': 'heart-pulse',
  'Other': 'tag',
  'Salary': 'briefcase',
  'Freelance & Consulting': 'laptop',
  'Investments & Dividends': 'trending-up',
  'Side Hustle': 'rocket',
  'Gift & Bonus': 'gift',
  'Other Income': 'dollar-sign'
};

const DEFAULT_BUDGET_LIMITS = {
  'Housing': 1300,
  'Food & Dining': 550,
  'Utilities': 250,
  'Entertainment': 180,
  'Transportation': 220,
  'Shopping': 250,
  'Healthcare': 150,
  'Other': 100
};

// =============================================================================
// 2. APPLICATION STATE
// =============================================================================

let state = {
  transactions: [],
  budgets: { ...DEFAULT_BUDGET_LIMITS },
  filters: {
    search: '',
    category: 'ALL',
    type: 'ALL',
    sortBy: 'date-desc'
  },
  charts: {
    categoryChart: null,
    comparisonChart: null
  }
};

// =============================================================================
// 3. PERSISTENCE & LOCAL STORAGE HELPERS
// =============================================================================

function loadFromStorage() {
  try {
    const storedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const storedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);

    if (storedTx) {
      state.transactions = JSON.parse(storedTx);
    } else {
      // If first run, auto-populate demo data for an instant wow experience
      state.transactions = generateSampleTransactions();
      saveToStorage();
    }

    if (storedBudgets) {
      state.budgets = { ...DEFAULT_BUDGET_LIMITS, ...JSON.parse(storedBudgets) };
    } else {
      state.budgets = { ...DEFAULT_BUDGET_LIMITS };
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(state.budgets));
    }
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    state.transactions = [];
    state.budgets = { ...DEFAULT_BUDGET_LIMITS };
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(state.budgets));
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
}

// =============================================================================
// 4. DEMO DATA GENERATOR
// =============================================================================

function generateSampleTransactions() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  // Helper to build dates in the current month
  const formatDate = (day) => `${year}-${month}-${String(day).padStart(2, '0')}`;

  return [
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'Monthly Tech Salary',
      amount: 4200.00,
      type: 'income',
      category: 'Salary',
      date: formatDate(1)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'Luxury Apartment Rent',
      amount: 1250.00,
      type: 'expense',
      category: 'Housing',
      date: formatDate(2)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'Whole Foods Market',
      amount: 178.45,
      type: 'expense',
      category: 'Food & Dining',
      date: formatDate(4)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'Power & Gas Utility',
      amount: 124.80,
      type: 'expense',
      category: 'Utilities',
      date: formatDate(5)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'UI/UX Freelance Retainer',
      amount: 1150.00,
      type: 'income',
      category: 'Freelance & Consulting',
      date: formatDate(8)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'Fiber Internet 1Gbps',
      amount: 70.00,
      type: 'expense',
      category: 'Utilities',
      date: formatDate(10)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'Weekend Dining & Sushi',
      amount: 112.50,
      type: 'expense',
      category: 'Food & Dining',
      date: formatDate(12)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'Metro & Train Pass',
      amount: 95.00,
      type: 'expense',
      category: 'Transportation',
      date: formatDate(14)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'Stock Dividend Yield',
      amount: 235.00,
      type: 'income',
      category: 'Investments & Dividends',
      date: formatDate(15)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'Streaming & Cloud Subscriptions',
      amount: 38.99,
      type: 'expense',
      category: 'Entertainment',
      date: formatDate(16)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'Concert & Cinema Tickets',
      amount: 155.00,
      type: 'expense',
      category: 'Entertainment',
      date: formatDate(18)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'New Wireless Headphones',
      amount: 219.00,
      type: 'expense',
      category: 'Shopping',
      date: formatDate(20)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'Gym & Fitness Membership',
      amount: 75.00,
      type: 'expense',
      category: 'Healthcare',
      date: formatDate(22)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'Trader Joe’s Groceries',
      amount: 164.20,
      type: 'expense',
      category: 'Food & Dining',
      date: formatDate(24)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'Fuel & Ride Sharing',
      amount: 85.50,
      type: 'expense',
      category: 'Transportation',
      date: formatDate(25)
    },
    {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title: 'Specialty Pharmacy & Wellness',
      amount: 48.00,
      type: 'expense',
      category: 'Healthcare',
      date: formatDate(26)
    }
  ];
}

// =============================================================================
// 5. FORMATTING & MATH UTILITIES
// =============================================================================

function formatCurrency(num) {
  const val = Number(num) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val);
}

function formatDateString(isoDate) {
  if (!isoDate) return 'N/A';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return isoDate;
}

// =============================================================================
// 6. METRIC COMPUTATIONS
// =============================================================================

function computeMetrics() {
  let totalIncome = 0;
  let totalExpenses = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  state.transactions.forEach(tx => {
    const amount = Number(tx.amount) || 0;
    if (tx.type === 'income') {
      totalIncome += amount;
      incomeCount++;
    } else {
      totalExpenses += amount;
      expenseCount++;
    }
  });

  const totalBalance = totalIncome - totalExpenses;

  // Budget Health calculation:
  // Based on spending ratio against income & budget caps
  let healthPercentage = 100;
  if (totalIncome > 0) {
    const spentRatio = totalExpenses / totalIncome;
    // If spending 0%, health is 100%. If spending 100% or more, health scales down to 0%
    healthPercentage = Math.max(0, Math.min(100, Math.round((1 - spentRatio) * 100)));
  } else if (totalExpenses > 0) {
    healthPercentage = 0;
  }

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    incomeCount,
    expenseCount,
    healthPercentage
  };
}

// =============================================================================
// 7. UI RENDER ENGINE
// =============================================================================

function renderAll() {
  renderSummaryMetrics();
  renderVisualizers();
  renderBudgetGoals();
  renderTransactionsTable();
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * 7.1 Summary Metrics Cards
 */
function renderSummaryMetrics() {
  const m = computeMetrics();

  // Metric 1: Total Balance
  const elBalance = document.getElementById('metricTotalBalance');
  const elBalanceStatus = document.getElementById('metricBalanceStatus');
  elBalance.textContent = formatCurrency(m.totalBalance);

  if (m.totalBalance >= 0) {
    elBalance.className = 'text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight';
    elBalanceStatus.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold';
    elBalanceStatus.innerHTML = '<i data-lucide="trending-up" class="w-3.5 h-3.5"></i><span>Positive Surplus</span>';
  } else {
    elBalance.className = 'text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight';
    elBalanceStatus.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold';
    elBalanceStatus.innerHTML = '<i data-lucide="trending-down" class="w-3.5 h-3.5"></i><span>Net Deficit</span>';
  }

  // Metric 2: Total Income
  document.getElementById('metricTotalIncome').textContent = formatCurrency(m.totalIncome);
  document.getElementById('metricIncomeEntries').textContent = `${m.incomeCount} incoming stream${m.incomeCount === 1 ? '' : 's'}`;

  // Metric 3: Total Expenses
  document.getElementById('metricTotalExpenses').textContent = formatCurrency(m.totalExpenses);
  document.getElementById('metricExpenseEntries').textContent = `${m.expenseCount} outlay${m.expenseCount === 1 ? '' : 's'} recorded`;

  // Metric 4: Budget Health
  const elHealth = document.getElementById('metricBudgetHealth');
  const elHealthRating = document.getElementById('metricHealthRating');
  const elHealthBar = document.getElementById('metricHealthBar');
  const sidebarHealthBadge = document.getElementById('sidebarHealthBadge');
  const sidebarHealthBar = document.getElementById('sidebarHealthBar');

  elHealth.textContent = `${m.healthPercentage}%`;
  elHealthBar.style.width = `${m.healthPercentage}%`;
  if (sidebarHealthBar) sidebarHealthBar.style.width = `${m.healthPercentage}%`;

  let healthLabel = 'Optimal';
  let badgeClasses = 'text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700';
  let barColor = 'bg-emerald-500';

  if (m.healthPercentage >= 60) {
    healthLabel = 'Optimal';
    badgeClasses = 'text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700';
    barColor = 'bg-emerald-500';
  } else if (m.healthPercentage >= 30) {
    healthLabel = 'Moderate';
    badgeClasses = 'text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700';
    barColor = 'bg-amber-500';
  } else {
    healthLabel = 'Deficit Alert';
    badgeClasses = 'text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700';
    barColor = 'bg-rose-500';
  }

  elHealthRating.textContent = healthLabel;
  elHealthRating.className = badgeClasses;
  elHealthBar.className = `${barColor} h-2 rounded-full transition-all duration-500`;

  if (sidebarHealthBadge) {
    sidebarHealthBadge.textContent = healthLabel;
    sidebarHealthBadge.className = m.healthPercentage >= 50 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold';
  }
}

/**
 * 7.2 Interactive Visualizers (Chart.js)
 */
function renderVisualizers() {
  const m = computeMetrics();

  // Calculate expense breakdown by category
  const expenseByCategory = {};
  EXPENSE_CATEGORIES.forEach(cat => { expenseByCategory[cat] = 0; });

  state.transactions.forEach(tx => {
    if (tx.type === 'expense') {
      const cat = tx.category || 'Other';
      const amount = Number(tx.amount) || 0;
      expenseByCategory[cat] = (expenseByCategory[cat] || 0) + amount;
    }
  });

  // Filter categories that have spending > 0 for doughnut chart
  const activeExpenseEntries = Object.entries(expenseByCategory).filter(([_, amt]) => amt > 0);
  
  // Doughnut Chart Setup
  const doughnutEmptyEl = document.getElementById('categoryChartEmpty');
  const doughnutTotalPill = document.getElementById('doughnutTotalPill');
  const categoryLegendEl = document.getElementById('categoryBreakdownLegend');
  doughnutTotalPill.textContent = `${formatCurrency(m.totalExpenses)} Total`;

  if (activeExpenseEntries.length === 0) {
    doughnutEmptyEl.classList.remove('hidden');
    categoryLegendEl.innerHTML = '<p class="col-span-2 text-center text-slate-400 py-2">No category records yet</p>';
    if (state.charts.categoryChart) {
      state.charts.categoryChart.destroy();
      state.charts.categoryChart = null;
    }
  } else {
    doughnutEmptyEl.classList.add('hidden');

    const labels = activeExpenseEntries.map(([cat]) => cat);
    const dataValues = activeExpenseEntries.map(([_, amt]) => amt);
    const backgroundColors = activeExpenseEntries.map(([cat]) => CATEGORY_COLORS[cat] || '#6366f1');

    // Build custom mini legend beneath chart
    categoryLegendEl.innerHTML = activeExpenseEntries.map(([cat, amt]) => {
      const pct = m.totalExpenses > 0 ? Math.round((amt / m.totalExpenses) * 100) : 0;
      const color = CATEGORY_COLORS[cat] || '#6366f1';
      return `
        <div class="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition">
          <div class="flex items-center gap-1.5 truncate">
            <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: ${color}"></span>
            <span class="truncate font-medium text-slate-700">${cat}</span>
          </div>
          <span class="font-bold text-slate-900 ml-1">${pct}%</span>
        </div>
      `;
    }).join('');

    const ctxCategory = document.getElementById('categoryChart').getContext('2d');
    if (state.charts.categoryChart) {
      state.charts.categoryChart.destroy();
    }

    state.charts.categoryChart = new Chart(ctxCategory, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: backgroundColors,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            display: false // We use our custom styled legend beneath
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw || 0;
                const percentage = m.totalExpenses > 0 ? ((value / m.totalExpenses) * 100).toFixed(1) : 0;
                return ` ${context.label}: ${formatCurrency(value)} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Bar Chart Setup: Cash Flow Comparison & Savings
  const comparisonEmptyEl = document.getElementById('comparisonChartEmpty');
  const savingsRatePill = document.getElementById('savingsRatePill');

  const savingsRate = m.totalIncome > 0
    ? (((m.totalIncome - m.totalExpenses) / m.totalIncome) * 100).toFixed(1)
    : '0.0';
  savingsRatePill.textContent = `${savingsRate}%`;

  if (m.totalIncome === 0 && m.totalExpenses === 0) {
    comparisonEmptyEl.classList.remove('hidden');
    if (state.charts.comparisonChart) {
      state.charts.comparisonChart.destroy();
      state.charts.comparisonChart = null;
    }
  } else {
    comparisonEmptyEl.classList.add('hidden');

    // Grouping transactions by week in the month or side-by-side totals
    // Let's create weekly buckets (Week 1: 1-7, Week 2: 8-14, Week 3: 15-21, Week 4+: 22-31)
    const weeks = ['Week 1 (1-7)', 'Week 2 (8-14)', 'Week 3 (15-21)', 'Week 4 (22+)'];
    const incomeByWeek = [0, 0, 0, 0];
    const expenseByWeek = [0, 0, 0, 0];

    state.transactions.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      let day = 1;
      if (tx.date) {
        const parts = tx.date.split('-');
        if (parts.length === 3) day = parseInt(parts[2], 10);
      }
      let weekIdx = 0;
      if (day > 21) weekIdx = 3;
      else if (day > 14) weekIdx = 2;
      else if (day > 7) weekIdx = 1;

      if (tx.type === 'income') {
        incomeByWeek[weekIdx] += amt;
      } else {
        expenseByWeek[weekIdx] += amt;
      }
    });

    const ctxComparison = document.getElementById('comparisonChart').getContext('2d');
    if (state.charts.comparisonChart) {
      state.charts.comparisonChart.destroy();
    }

    state.charts.comparisonChart = new Chart(ctxComparison, {
      type: 'bar',
      data: {
        labels: weeks,
        datasets: [
          {
            label: 'Income',
            data: incomeByWeek,
            backgroundColor: '#10b981',
            borderRadius: 6,
            maxBarThickness: 32
          },
          {
            label: 'Expenses',
            data: expenseByWeek,
            backgroundColor: '#f43f5e',
            borderRadius: 6,
            maxBarThickness: 32
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                family: 'Inter',
                size: 11
              },
              color: '#64748b'
            }
          },
          y: {
            grid: {
              color: '#f1f5f9'
            },
            ticks: {
              font: {
                family: 'Inter',
                size: 11
              },
              color: '#64748b',
              callback: function (value) {
                return '$' + value;
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return ` ${context.dataset.label}: ${formatCurrency(context.raw)}`;
              }
            }
          }
        }
      }
    });
  }
}

/**
 * 7.3 Budget Goal Tracker Progress Bars
 * Turns yellow at 80%, red at 100%+
 */
function renderBudgetGoals() {
  const container = document.getElementById('budgetProgressContainer');
  if (!container) return;

  // Calculate total spent per category
  const categorySpending = {};
  EXPENSE_CATEGORIES.forEach(cat => { categorySpending[cat] = 0; });

  state.transactions.forEach(tx => {
    if (tx.type === 'expense') {
      const cat = tx.category || 'Other';
      categorySpending[cat] = (categorySpending[cat] || 0) + (Number(tx.amount) || 0);
    }
  });

  const cardsHtml = EXPENSE_CATEGORIES.map(category => {
    const limit = state.budgets[category] || DEFAULT_BUDGET_LIMITS[category] || 200;
    const spent = categorySpending[category] || 0;
    const ratio = limit > 0 ? (spent / limit) : 0;
    const percentage = Math.round(ratio * 100);
    const iconName = CATEGORY_ICONS[category] || 'tag';

    // Status styling rules:
    // Green: < 80%
    // Yellow (warning): 80% - 99.9%
    // Red (danger): 100%+
    let barColor = 'bg-emerald-500';
    let badgeText = 'Normal';
    let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    let statusText = `${formatCurrency(limit - spent)} remaining`;
    let isOver = false;

    if (percentage >= 100) {
      barColor = 'bg-rose-500';
      badgeText = 'Over Budget!';
      badgeClass = 'bg-rose-50 text-rose-700 border-rose-200 font-bold budget-overrun-pulse';
      statusText = `Over by ${formatCurrency(spent - limit)}`;
      isOver = true;
    } else if (percentage >= 80) {
      barColor = 'bg-amber-500';
      badgeText = 'Near Limit';
      badgeClass = 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
      statusText = `Warning: ${percentage}% spent`;
    }

    const clampedWidth = Math.min(percentage, 100);

    return `
      <div class="p-4 rounded-xl border ${isOver ? 'border-rose-200 bg-rose-50/20' : 'border-slate-100 bg-slate-50/50'} hover:bg-white hover:shadow-card transition duration-200">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white" style="background-color: ${CATEGORY_COLORS[category] || '#6366f1'}">
              <i data-lucide="${iconName}" class="w-4 h-4"></i>
            </div>
            <div>
              <span class="text-xs font-bold text-slate-800">${category}</span>
              <p class="text-[10px] text-slate-400">Target: ${formatCurrency(limit)}</p>
            </div>
          </div>
          <span class="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeClass}">
            ${badgeText}
          </span>
        </div>

        <!-- Progress Track -->
        <div class="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden my-2">
          <div class="${barColor} h-2 rounded-full progress-bar-fill" style="width: ${clampedWidth}%"></div>
        </div>

        <div class="flex items-center justify-between text-xs font-medium mt-1">
          <span class="text-slate-600 font-semibold">${formatCurrency(spent)} <span class="text-slate-400 font-normal">/ ${formatCurrency(limit)}</span></span>
          <span class="${isOver ? 'text-rose-600 font-bold' : 'text-slate-500'}">${statusText}</span>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = cardsHtml;
}

/**
 * 7.4 Transaction Tracker Table with Filtering & Sorting
 */
function renderTransactionsTable() {
  const tbody = document.getElementById('transactionsTableBody');
  const emptyState = document.getElementById('emptyTableState');
  const visibleCountEl = document.getElementById('visibleTransactionsCount');
  const totalCountEl = document.getElementById('totalTransactionsCount');

  totalCountEl.textContent = state.transactions.length;

  // Filter transactions
  let filtered = state.transactions.filter(tx => {
    // Search keyword
    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      const matchTitle = (tx.title || '').toLowerCase().includes(q);
      const matchCategory = (tx.category || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCategory) return false;
    }

    // Type filter
    if (state.filters.type !== 'ALL' && tx.type !== state.filters.type) {
      return false;
    }

    // Category filter
    if (state.filters.category !== 'ALL' && tx.category !== state.filters.category) {
      return false;
    }

    return true;
  });

  // Sort transactions
  filtered.sort((a, b) => {
    switch (state.filters.sortBy) {
      case 'date-asc':
        return (a.date || '').localeCompare(b.date || '');
      case 'date-desc':
        return (b.date || '').localeCompare(a.date || '');
      case 'amount-asc':
        return Number(a.amount) - Number(b.amount);
      case 'amount-desc':
        return Number(b.amount) - Number(a.amount);
      default:
        return 0;
    }
  });

  visibleCountEl.textContent = filtered.length;

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  tbody.innerHTML = filtered.map(tx => {
    const isIncome = tx.type === 'income';
    const iconName = CATEGORY_ICONS[tx.category] || (isIncome ? 'arrow-down-left' : 'arrow-up-right');
    const color = CATEGORY_COLORS[tx.category] || (isIncome ? '#10b981' : '#f43f5e');

    return `
      <tr class="hover:bg-slate-50/80 transition-colors group">
        <!-- Title & Icon -->
        <td class="py-3.5 px-5">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style="background-color: ${color}15; color: ${color};">
              <i data-lucide="${iconName}" class="w-4 h-4"></i>
            </div>
            <div class="truncate max-w-xs sm:max-w-sm">
              <div class="font-semibold text-slate-800 truncate">${escapeHtml(tx.title)}</div>
              <div class="text-[11px] text-slate-400 sm:hidden">${escapeHtml(tx.category)} &bull; ${formatDateString(tx.date)}</div>
            </div>
          </div>
        </td>

        <!-- Category -->
        <td class="py-3.5 px-4 hidden sm:table-cell">
          <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
            ${escapeHtml(tx.category)}
          </span>
        </td>

        <!-- Date -->
        <td class="py-3.5 px-4 text-xs font-medium text-slate-500 whitespace-nowrap hidden sm:table-cell">
          ${formatDateString(tx.date)}
        </td>

        <!-- Type -->
        <td class="py-3.5 px-4">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${isIncome ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}">
            ${isIncome ? 'Income' : 'Expense'}
          </span>
        </td>

        <!-- Amount -->
        <td class="py-3.5 px-4 text-right font-bold whitespace-nowrap ${isIncome ? 'text-emerald-600' : 'text-slate-900'}">
          ${isIncome ? '+' : '-'}${formatCurrency(tx.amount)}
        </td>

        <!-- Actions -->
        <td class="py-3.5 px-5 text-right whitespace-nowrap">
          <div class="inline-flex items-center space-x-1">
            <button onclick="handleEditTransaction('${tx.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition" title="Edit entry">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
            </button>
            <button onclick="handleDeleteTransaction('${tx.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition" title="Delete entry">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =============================================================================
// 8. TRANSACTION CRUD ACTIONS
// =============================================================================

function populateCategoryDropdown(type, selectedCategory = '') {
  const select = document.getElementById('transactionCategory');
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  select.innerHTML = categories.map(cat => `
    <option value="${cat}" ${cat === selectedCategory ? 'selected' : ''}>${cat}</option>
  `).join('');
}

function populateFilterCategoryOptions() {
  const filterSelect = document.getElementById('categoryFilter');
  const allCategories = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

  filterSelect.innerHTML = '<option value="ALL">All Categories</option>' + allCategories.map(cat => `
    <option value="${cat}">${cat}</option>
  `).join('');
}

function openTransactionModal(editId = null) {
  const modal = document.getElementById('transactionModal');
  const form = document.getElementById('transactionForm');
  const modalTitle = document.getElementById('modalTitle');
  const typeExpenseBtn = document.getElementById('typeExpenseBtn');
  const typeIncomeBtn = document.getElementById('typeIncomeBtn');
  const hiddenType = document.getElementById('transactionType');
  const editIdInput = document.getElementById('editTransactionId');

  form.reset();

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('transactionDate').value = today;

  if (editId) {
    const tx = state.transactions.find(t => t.id === editId);
    if (tx) {
      modalTitle.textContent = 'Edit Transaction';
      editIdInput.value = tx.id;
      document.getElementById('transactionTitle').value = tx.title;
      document.getElementById('transactionAmount').value = tx.amount;
      document.getElementById('transactionDate').value = tx.date;
      setModalType(tx.type);
      populateCategoryDropdown(tx.type, tx.category);
    }
  } else {
    modalTitle.textContent = 'Add Transaction';
    editIdInput.value = '';
    setModalType('expense');
    populateCategoryDropdown('expense');
  }

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
  document.getElementById('transactionTitle').focus();
}

function closeTransactionModal() {
  document.getElementById('transactionModal').classList.add('hidden');
}

function setModalType(type) {
  const hiddenType = document.getElementById('transactionType');
  const typeExpenseBtn = document.getElementById('typeExpenseBtn');
  const typeIncomeBtn = document.getElementById('typeIncomeBtn');

  hiddenType.value = type;

  if (type === 'income') {
    typeIncomeBtn.className = 'py-2 text-xs font-bold rounded-lg text-emerald-600 bg-white shadow-sm transition flex items-center justify-center gap-1.5';
    typeExpenseBtn.className = 'py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-700 transition flex items-center justify-center gap-1.5';
  } else {
    typeExpenseBtn.className = 'py-2 text-xs font-bold rounded-lg text-rose-600 bg-white shadow-sm transition flex items-center justify-center gap-1.5';
    typeIncomeBtn.className = 'py-2 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-700 transition flex items-center justify-center gap-1.5';
  }

  populateCategoryDropdown(type);
  if (window.lucide) window.lucide.createIcons();
}

function handleSaveTransaction(e) {
  e.preventDefault();

  const editId = document.getElementById('editTransactionId').value;
  const title = document.getElementById('transactionTitle').value.trim();
  const amount = parseFloat(document.getElementById('transactionAmount').value);
  const date = document.getElementById('transactionDate').value;
  const type = document.getElementById('transactionType').value;
  const category = document.getElementById('transactionCategory').value;

  if (!title || isNaN(amount) || amount <= 0 || !date) {
    showToast('Please fill in all required fields with valid values.', 'warning');
    return;
  }

  if (editId) {
    const idx = state.transactions.findIndex(t => t.id === editId);
    if (idx !== -1) {
      state.transactions[idx] = {
        ...state.transactions[idx],
        title,
        amount,
        date,
        type,
        category
      };
      showToast('Transaction successfully updated.', 'success');
    }
  } else {
    const newTx = {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      title,
      amount,
      date,
      type,
      category
    };
    state.transactions.unshift(newTx);
    showToast('New transaction added.', 'success');
  }

  saveToStorage();
  renderAll();
  closeTransactionModal();
}

// Global actions exposed to inline HTML table buttons
window.handleEditTransaction = function (id) {
  openTransactionModal(id);
};

window.handleDeleteTransaction = function (id) {
  const tx = state.transactions.find(t => t.id === id);
  const title = tx ? tx.title : 'entry';
  
  state.transactions = state.transactions.filter(t => t.id !== id);
  saveToStorage();
  renderAll();
  showToast(`Deleted "${title}"`, 'info');
};

// =============================================================================
// 9. BUDGET LIMITS MODAL HANDLERS
// =============================================================================

function openBudgetLimitsModal() {
  const container = document.getElementById('budgetInputsContainer');
  const modal = document.getElementById('budgetModal');

  container.innerHTML = EXPENSE_CATEGORIES.map(cat => {
    const currentLimit = state.budgets[cat] || DEFAULT_BUDGET_LIMITS[cat] || 200;
    const iconName = CATEGORY_ICONS[cat] || 'tag';
    return `
      <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white" style="background-color: ${CATEGORY_COLORS[cat] || '#6366f1'}">
            <i data-lucide="${iconName}" class="w-4 h-4"></i>
          </div>
          <label for="budget_${cat}" class="text-xs font-bold text-slate-800">${cat}</label>
        </div>
        <div class="relative w-36">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
          <input type="number" min="0" step="10" id="budget_${cat}" name="${cat}" value="${currentLimit}" class="w-full pl-7 pr-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-right" />
        </div>
      </div>
    `;
  }).join('');

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeBudgetLimitsModal() {
  document.getElementById('budgetModal').classList.add('hidden');
}

function handleSaveBudgetLimits(e) {
  e.preventDefault();
  const formData = new FormData(e.target);

  EXPENSE_CATEGORIES.forEach(cat => {
    const val = parseFloat(formData.get(cat));
    state.budgets[cat] = isNaN(val) ? DEFAULT_BUDGET_LIMITS[cat] : Math.max(0, val);
  });

  saveToStorage();
  renderAll();
  closeBudgetLimitsModal();
  showToast('Budget limits updated successfully.', 'success');
}

// =============================================================================
// 10. CLEAR DATA & CONFIRMATION MODAL
// =============================================================================

function openConfirmClearModal() {
  document.getElementById('confirmModal').classList.remove('hidden');
}

function closeConfirmClearModal() {
  document.getElementById('confirmModal').classList.add('hidden');
}

function executeClearAllData() {
  state.transactions = [];
  saveToStorage();
  renderAll();
  closeConfirmClearModal();
  showToast('All transaction data cleared.', 'info');
}

// =============================================================================
// 11. EXPORT TO CSV
// =============================================================================

function exportTransactionsToCsv() {
  if (state.transactions.length === 0) {
    showToast('No transactions to export.', 'warning');
    return;
  }

  const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount'];
  const rows = state.transactions.map(t => [
    `"${t.id}"`,
    `"${t.date}"`,
    `"${t.type}"`,
    `"${t.category}"`,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    t.amount
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `SpendWise_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('CSV export downloaded.', 'success');
}

// =============================================================================
// 12. TOAST NOTIFICATIONS HELPER
// =============================================================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  const iconMap = {
    success: 'check-circle',
    warning: 'alert-triangle',
    info: 'info',
    error: 'x-circle'
  };

  const bgMap = {
    success: 'bg-emerald-600 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-slate-900 text-white',
    error: 'bg-rose-600 text-white'
  };

  toast.className = `toast-item px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-xs sm:text-sm font-medium ${bgMap[type] || bgMap.info}`;
  toast.innerHTML = `
    <i data-lucide="${iconMap[type] || 'info'}" class="w-4 h-4 flex-shrink-0"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// =============================================================================
// 13. INITIALIZATION & EVENT LISTENERS
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Load state
  loadFromStorage();
  populateFilterCategoryOptions();

  // 2. Set current date display
  const currentDateEl = document.getElementById('currentDateDisplay');
  if (currentDateEl) {
    const today = new Date();
    currentDateEl.textContent = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // 3. Render all initial UI components
  renderAll();

  // 4. Mobile sidebar toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  const toggleSidebar = (open) => {
    if (open) {
      sidebar.classList.remove('-translate-x-full');
      sidebarBackdrop.classList.remove('hidden');
    } else {
      sidebar.classList.add('-translate-x-full');
      sidebarBackdrop.classList.add('hidden');
    }
  };

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', () => toggleSidebar(true));
  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => toggleSidebar(false));
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', () => toggleSidebar(false));

  // 5. Global Action Buttons
  document.getElementById('loadDemoBtn').addEventListener('click', () => {
    state.transactions = generateSampleTransactions();
    saveToStorage();
    renderAll();
    showToast('Loaded realistic monthly demo data.', 'success');
  });

  document.getElementById('clearDataBtn').addEventListener('click', openConfirmClearModal);
  document.getElementById('cancelConfirmBtn').addEventListener('click', closeConfirmClearModal);
  document.getElementById('executeConfirmBtn').addEventListener('click', executeClearAllData);

  // 6. Transaction Modal Triggers
  document.getElementById('openAddModalBtn').addEventListener('click', () => openTransactionModal(null));
  document.getElementById('closeModalBtn').addEventListener('click', closeTransactionModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeTransactionModal);
  document.getElementById('transactionForm').addEventListener('submit', handleSaveTransaction);

  document.getElementById('typeExpenseBtn').addEventListener('click', () => setModalType('expense'));
  document.getElementById('typeIncomeBtn').addEventListener('click', () => setModalType('income'));

  // 7. Budget Modal Triggers
  document.getElementById('openBudgetLimitsModalBtn').addEventListener('click', openBudgetLimitsModal);
  document.getElementById('closeBudgetModalBtn').addEventListener('click', closeBudgetLimitsModal);
  document.getElementById('cancelBudgetModalBtn').addEventListener('click', closeBudgetLimitsModal);
  document.getElementById('budgetLimitsForm').addEventListener('submit', handleSaveBudgetLimits);
  document.getElementById('resetBudgetDefaultsBtn').addEventListener('click', () => {
    state.budgets = { ...DEFAULT_BUDGET_LIMITS };
    openBudgetLimitsModal();
    showToast('Reset budget inputs to defaults.', 'info');
  });

  // 8. Filter & Search Controls
  document.getElementById('searchInput').addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    renderTransactionsTable();
    if (window.lucide) window.lucide.createIcons();
  });

  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    state.filters.category = e.target.value;
    renderTransactionsTable();
    if (window.lucide) window.lucide.createIcons();
  });

  document.getElementById('typeFilter').addEventListener('change', (e) => {
    state.filters.type = e.target.value;
    renderTransactionsTable();
    if (window.lucide) window.lucide.createIcons();
  });

  document.getElementById('sortBy').addEventListener('change', (e) => {
    state.filters.sortBy = e.target.value;
    renderTransactionsTable();
    if (window.lucide) window.lucide.createIcons();
  });

  document.getElementById('resetFiltersBtn').addEventListener('click', () => {
    state.filters.search = '';
    state.filters.category = 'ALL';
    state.filters.type = 'ALL';
    state.filters.sortBy = 'date-desc';

    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = 'ALL';
    document.getElementById('typeFilter').value = 'ALL';
    document.getElementById('sortBy').value = 'date-desc';

    renderTransactionsTable();
    if (window.lucide) window.lucide.createIcons();
  });

  // 9. Export CSV
  document.getElementById('exportCsvBtn').addEventListener('click', exportTransactionsToCsv);

  // 10. Close modals on outside click or Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTransactionModal();
      closeBudgetLimitsModal();
      closeConfirmClearModal();
      toggleSidebar(false);
    }
  });

  [document.getElementById('transactionModal'), document.getElementById('budgetModal'), document.getElementById('confirmModal')].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    }
  });
});
