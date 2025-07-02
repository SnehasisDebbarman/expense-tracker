import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export type Expense = {
  date: string;
  category: string;
  amount: number;
  notes: string;
};

export async function exportExpensesToCSV(data: Expense[]) {
  const csv = `Date,Category,Amount,Notes\n` +
    data.map(item => `${item.date},${item.category},${item.amount},${item.notes}`).join('\n');

  const path = FileSystem.documentDirectory + 'expenses.csv';
  await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
  await Sharing.shareAsync(path);
}
