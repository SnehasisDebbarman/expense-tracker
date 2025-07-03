import { useColorSchemeMode } from '@/hooks/useColorScheme';
import { deleteAllExpenses, getAllExpenses, initDB } from '@/src/db/expenses';
import { exportExpensesToCSV } from '@/src/utils/exportToCSV';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Appbar, Button, RadioButton, Text } from 'react-native-paper';

export default function MiscScreen() {
    const router = useRouter();
    const [exporting, setExporting] = React.useState(false);
    const [resetting, setResetting] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const { mode, setMode } = useColorSchemeMode();

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

    const handleReset = async () => {
        setResetting(true);
        setMessage('');
        try {
            await deleteAllExpenses();
            setMessage('All expenses deleted!');
        } catch (e) {
            setMessage('Reset failed.');
        }
        setResetting(false);
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Misc & Settings" />
            </Appbar.Header>
            <Button mode="contained" onPress={handleExport} loading={exporting} disabled={exporting} style={{ marginBottom: 16 }}>
                Export to CSV
            </Button>
            <Button mode="contained" onPress={handleReset} loading={resetting} disabled={resetting} style={{ marginBottom: 16 }}>
                Reset All Balance
            </Button>
            <Text style={{ marginBottom: 8, marginTop: 16 }}>Theme</Text>
            <RadioButton.Group onValueChange={value => setMode(value as any)} value={mode}>
                <RadioButton.Item label="System" value="system" />
                <RadioButton.Item label="Light" value="light" />
                <RadioButton.Item label="Dark" value="dark" />
            </RadioButton.Group>
            {message ? <Text style={{ marginTop: 16 }}>{message}</Text> : null}
        </View>
    );
} 