import DateTimePicker from '@react-native-community/datetimepicker';
import * as React from 'react';
import { Platform } from 'react-native';
import { Button, HelperText, Menu, Modal, Portal, TextInput, useTheme } from 'react-native-paper';
import { addExpense, Expense } from '../db/expenses';
import { globalEventEmitter } from '../utils/EventEmitter';

interface AddExpenseModalProps {
    visible: boolean;
    onClose: () => void;
    onExpenseAdded?: () => void;
}

export default function AddExpenseModal({ visible, onClose, onExpenseAdded }: AddExpenseModalProps) {
    const theme = useTheme();
    const [amount, setAmount] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [dateObj, setDateObj] = React.useState(new Date());
    const [categoryMenuVisible, setCategoryMenuVisible] = React.useState(false);
    const categoryButtonRef = React.useRef(null);
    const categories = [
        'Food',
        'Travel',
        'Shopping',
        'Bills',
        'Health',
        'Other',
    ];

    const resetForm = () => {
        setAmount('');
        setCategory('');
        setDate(new Date().toISOString().slice(0, 10));
        setNotes('');
        setError('');
    };

    const handleSave = async () => {
        setError('');
        if (!amount || !category || !date) {
            setError('Please fill all required fields.');
            return;
        }
        setLoading(true);
        await addExpense({
            date,
            category,
            amount: parseFloat(amount),
            notes,
        } as Expense);
        setLoading(false);
        resetForm();
        onClose();
        if (onExpenseAdded) onExpenseAdded();
        globalEventEmitter.emit('expenseAdded');
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDateObj(selectedDate);
            setDate(selectedDate.toISOString().slice(0, 10));
        }
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onClose} contentContainerStyle={{
                backgroundColor: theme.colors.background,
                margin: 24,
                borderRadius: 12,
                padding: 20,
            }}>
                <TextInput
                    label="Amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={{ marginBottom: 12 }}
                />
                <Menu
                    visible={categoryMenuVisible}
                    onDismiss={() => setCategoryMenuVisible(false)}
                    anchor={<Button mode="outlined" ref={categoryButtonRef} onPress={() => setCategoryMenuVisible(true)} style={{ marginBottom: 12 }}>
                        {category ? category : 'Select Category'}
                    </Button>}
                >
                    {categories.map(cat => (
                        <Menu.Item key={cat} onPress={() => { setCategory(cat); setCategoryMenuVisible(false); }} title={cat} />
                    ))}
                </Menu>
                <TextInput
                    label="Date"
                    value={date}
                    style={{ marginBottom: 12 }}
                    editable={false}
                    right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePicker(true)} />}
                />
                {showDatePicker && (
                    <DateTimePicker
                        value={dateObj}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateChange}
                    />
                )}
                <TextInput
                    label="Notes"
                    value={notes}
                    onChangeText={setNotes}
                    style={{ marginBottom: 12 }}
                    multiline
                />
                <HelperText type="error" visible={!!error}>{error}</HelperText>
                <Button mode="contained" onPress={handleSave} loading={loading} disabled={loading} style={{ marginTop: 16 }}>
                    Save Expense
                </Button>
                <Button onPress={onClose} style={{ marginTop: 8 }}>
                    Cancel
                </Button>
            </Modal>
        </Portal>
    );
} 