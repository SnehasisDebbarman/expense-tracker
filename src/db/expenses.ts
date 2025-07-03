import * as SQLite from 'expo-sqlite';

export type Expense = {
  id?: number;
  date: string;
  category: string;
  amount: number;
  notes: string;
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('expenses.db');
  }
  return dbPromise;
}

export async function initDB() {
  const db = await getDB();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      category TEXT,
      amount REAL,
      notes TEXT
    );
  `);
}

export async function addExpense(expense: Expense, callback?: () => void) {
  const db = await getDB();
  await db.runAsync(
    'INSERT INTO expenses (date, category, amount, notes) VALUES (?, ?, ?, ?)',
    [expense.date, expense.category, expense.amount, expense.notes]
  );
  if (callback) callback();
}

export async function getAllExpenses(callback: (expenses: Expense[]) => void) {
  const db = await getDB();
  const rows = await db.getAllAsync<Expense>('SELECT * FROM expenses');
  callback(rows);
}

export async function getExpenseById(id: number): Promise<Expense | undefined> {
  const db = await getDB();
  const rows = await db.getAllAsync<Expense>('SELECT * FROM expenses WHERE id = ?', [id]);
  return rows[0];
}

export async function updateExpense(expense: Expense) {
  if (expense.id === undefined) throw new Error('Expense id is required for update');
  const db = await getDB();
  await db.runAsync(
    'UPDATE expenses SET date = ?, category = ?, amount = ?, notes = ? WHERE id = ?',
    [expense.date, expense.category, expense.amount, expense.notes, expense.id]
  );
}

export async function deleteAllExpenses() {
  const db = await getDB();
  await db.runAsync('DELETE FROM expenses');
}
