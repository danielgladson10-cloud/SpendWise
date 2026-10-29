# SpendWise — Interactive Expense & Budget Visualizer

> A modern, responsive single-page personal finance dashboard designed for tracking cash flow, analyzing expenses, and monitoring budget targets with real-time analytics.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

---

## ✨ Features

- **📊 Dynamic Summary Dashboard**: Live KPI cards for Total Net Balance, Total Income, Total Expenses, and an overall Budget Health score with visual status alerts.
- **🍩 Interactive Category Breakdown**: Chart.js doughnut visualizer categorizing outlays across Housing, Food & Dining, Utilities, Entertainment, Transportation, Shopping, and Healthcare.
- **📈 Cash Flow Trends**: Side-by-side comparative bar chart visualizing income vs. expenses grouped by month intervals.
- **🎯 Budget Goal Tracker**: Visual progress meters that change color dynamically based on consumption:
  - 🟢 `< 80%`: Safe / Normal
  - 🟡 `80% - 99.9%`: Near Limit Warning
  - 🔴 `100%+`: Over Budget Alert with deficit calculations
- **⚙️ Customizable Budget Limits**: Set custom monthly targets per category and persist them locally.
- **🧾 Complete Transaction Tracker**:
  - Add, edit, and delete transactions with dynamic form validation.
  - Live search by title, description, or category.
  - Filter by transaction type (Income / Expense) and category.
  - Sort by date (newest/oldest) or amount (high/low).
  - Export filtered transactions directly to **CSV**.
- **💾 Local Persistence**: All data is automatically preserved in your browser's `localStorage`.
- **⚡ Instant Demo Experience**: Built-in "Load Demo Data" button for immediate visual feedback.

---

## 🛠️ Tech Stack

- **HTML5 & Vanilla JavaScript (ES6+)**: Zero framework overhead, lightning fast execution.
- **Tailwind CSS**: Modern utility-first styling with sleek fintech UI palette and custom animations.
- **Chart.js**: Responsive, interactive canvas charts with custom tooltips.
- **Lucide Icons**: Crisp icon library for clean visuals.
- **Inter Font**: Modern typography via Google Fonts.

---

## 🚀 Quick Start / Local Preview

No installation or node build step required! Simply clone and open:

```bash
# Clone the repository
git clone https://github.com/<your-username>/spendwise.git
cd spendwise

# Run with any local server (e.g. Python)
python -m http.server 3000
```

Then visit [http://localhost:3000](http://localhost:3000) in your browser.

Alternatively, you can simply double-click `index.html` to run directly in any web browser.

---

## 📄 License

MIT License. Feel free to use and customize for personal or commercial projects.
