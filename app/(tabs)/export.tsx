import { getAllExpenses, initDB } from '@/src/db/expenses';
import { exportExpensesToCSV } from '@/src/utils/exportToCSV';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Appbar, Button, Text } from 'react-native-paper';

export default function ExportScreen() {
    const router = useRouter();
    const [exporting, setExporting] = React.useState(false);
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        initDB();
    }, []);

    const handleExport = async () => {
        setExporting(true);
        setMessage('');
        try {
            getAllExpenses(async (expenses) => {
                await exportExpensesToCSV(expenses);
                setMessage('Exported successfully!');
                setExporting(false);
            });
        } catch (e) {
            setMessage('Export failed.');
            setExporting(false);
        }
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Export Expenses" />
            </Appbar.Header>
            <Button mode="contained" onPress={handleExport} loading={exporting} disabled={exporting}>
                Export to CSV
            </Button>
            {message ? <Text style={{ marginTop: 16 }}>{message}</Text> : null}
        </View>
    );
} 