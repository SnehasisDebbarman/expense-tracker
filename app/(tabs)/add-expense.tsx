import { addExpense, initDB } from '@/src/db/expenses';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Appbar, Button, HelperText, TextInput } from 'react-native-paper';

export default function AddExpenseScreen() {
    const router = useRouter();
    const [amount, setAmount] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = React.useState('');
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        initDB();
    }, []);

    const onSave = () => {
        setError('');
        if (!amount || !category || !date) {
            setError('Please fill all required fields.');
            return;
        }
        addExpense({
            date,
            category,
            amount: parseFloat(amount),
            notes,
        }, () => {
            router.back();
        });
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Add Expense" />
            </Appbar.Header>
            <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={{ marginBottom: 12 }}
            />
            <TextInput
                label="Category"
                value={category}
                onChangeText={setCategory}
                style={{ marginBottom: 12 }}
            />
            <TextInput
                label="Date"
                value={date}
                onChangeText={setDate}
                style={{ marginBottom: 12 }}
            />
            <TextInput
                label="Notes"
                value={notes}
                onChangeText={setNotes}
                style={{ marginBottom: 12 }}
                multiline
            />
            <HelperText type="error" visible={!!error}>{error}</HelperText>
            <Button mode="contained" onPress={onSave} style={{ marginTop: 16 }}>
                Save Expense
            </Button>
        </View>
    );
} 