# 💰 Offline Expense Tracker App (Expo)

A full-featured offline expense tracker built with **Expo + React Native**. It stores all data locally using SQLite and lets you export your expenses as a CSV file.

## ✨ Features

- Offline-first storage powered by SQLite
- Add and delete expenses with categories and sub categories
- Dashboard with weekly and monthly totals
- Charts for visualising spending
- Export all expenses to CSV
- Dark mode themed UI
- Clear local data from the Settings screen

## 📦 Folder Structure

```
./Screens        React screens (Home, Graph, Export, Settings)
./Components     Reusable UI components
./DBQueries      SQLite helper functions
./Utilities      Utility modules (filters, CSV export)
App.js           Entry point
```

## 🗄️ SQLite Table Schema

```sql
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  expenseName TEXT NOT NULL,
  expenseCategory TEXT NOT NULL,
  subCategory TEXT,
  amount TEXT NOT NULL,
  dateNow TEXT NOT NULL,
  currentTime TEXT NOT NULL
);
```

## 📤 Export to CSV

```javascript
import { exportExpensesToCSV } from './Utilities/exportToCSV';

// Share a CSV of all expenses
await exportExpensesToCSV();
```

## 📦 Setup & Run

```bash
npm install
npx expo start
```

Open the project in Expo Go or an emulator to get started.

