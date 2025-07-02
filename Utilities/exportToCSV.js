import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getAllItems } from '../DBQueries';

export async function exportExpensesToCSV() {
  return new Promise((resolve, reject) => {
    getAllItems(async (data) => {
      try {
        const csv =
          'Date,Category,Amount,Notes\n' +
          data
            .map(
              (item) =>
                `${item.dateNow},${item.expenseCategory},${item.amount},${item.expenseName}`
            )
            .join('\n');
        const path = FileSystem.documentDirectory + 'expenses.csv';
        await FileSystem.writeAsStringAsync(path, csv, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        await Sharing.shareAsync(path);
        resolve(path);
      } catch (err) {
        reject(err);
      }
    });
  });
}
