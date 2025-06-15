# Expense Tracker

This is a mobile expense tracker built with [Expo](https://expo.dev/). It lets you record expenses, categorize them and visualize your spending.

## Features
- Add expenses with categories and subcategories
- View expenses grouped by day
- Basic statistics with pie or bar charts
- Offline storage powered by SQLite

## Running the project
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the Expo development server:
   ```sh
   npm start
   ```
3. Use the Expo Go app or an emulator to load the project from the printed QR code or URL.

## Development
The source code is organized in the following folders:
- `Screens/` – React components for each screen
- `Components/` – smaller UI components
- `DBQueries/` – SQLite helper functions
- `Utilities/` – utility modules (categories, list helpers)

Feel free to customize the categories in `Utilities/expenseNames.js` or add new features.

