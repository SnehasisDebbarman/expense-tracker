import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Text as RNText, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Button, IconButton, Menu, Text, useTheme } from 'react-native-paper';
// import { } from 'react-native-safe-area-context';

const categories = [
    { label: 'Shopping', icon: 'shopping' },
    { label: 'Food', icon: 'food' },
    { label: 'Gifts', icon: 'gift' },
    { label: 'Bills', icon: 'file-document' },
    { label: 'Travel', icon: 'airplane' },
    { label: 'Other', icon: 'dots-horizontal' },
];
const paymentTypes = [
    { label: 'Cash', icon: 'cash' },
    { label: 'Card', icon: 'credit-card' },
];

interface CustomAddExpenseProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (expense: {
        amount: number;
        category: string;
        payment: string;
        date: string;
        notes: string;
    }) => void;
    initialValues?: Partial<{
        amount: number;
        category: string;
        payment: string;
        date: string;
        notes: string;
    }>;
}

export default function CustomAddExpense({ visible, onClose, onSubmit, initialValues }: CustomAddExpenseProps) {
    const theme = useTheme();
    const [category, setCategory] = useState<{ label: string; icon: string } | null>(
        initialValues?.category ? categories.find(c => c.label === initialValues.category) || null : categories[0]
    );
    const [payment, setPayment] = useState(
        initialValues?.payment ? paymentTypes.find(p => p.label === initialValues.payment) || paymentTypes[0] : paymentTypes[0]
    );
    const [categoryMenu, setCategoryMenu] = useState(false);
    const [paymentMenu, setPaymentMenu] = useState(false);
    const [amount, setAmount] = useState(initialValues?.amount ? String(initialValues.amount) : '');
    const [comment, setComment] = useState(initialValues?.notes || '');
    const [date, setDate] = useState(initialValues?.date ? new Date(initialValues.date) : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [error, setError] = useState('');

    const handleKeypad = (val: string) => {
        if (val === 'del') setAmount(amount.slice(0, -1));
        else if (val === '.' && amount.includes('.')) return;
        else if (val === ',' || val === '$') return;
        else setAmount(amount + val);
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
    };

    const handleSubmit = () => {
        setError('');
        if (!amount || isNaN(Number(amount))) {
            setError('Please enter a valid amount.');
            return;
        }
        if (!category) {
            setError('Please select a category.');
            return;
        }
        onSubmit && onSubmit({
            amount: parseFloat(amount),
            category: category.label,
            payment: payment.label,
            date: date.toISOString().slice(0, 10),
            notes: comment,
        });
        setAmount('');
        setComment('');
        setDate(new Date());
        onClose && onClose();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.pillsRow}>
                    <Menu
                        visible={categoryMenu}
                        onDismiss={() => setCategoryMenu(false)}
                        anchor={
                            <TouchableOpacity style={[styles.pill, { backgroundColor: '#f3f3f3' }]} onPress={() => setCategoryMenu(true)}>
                                <IconButton icon={category?.icon || 'help'} size={18} />
                                <Text>{category ? category.label : 'Select Category'}</Text>
                            </TouchableOpacity>
                        }
                    >
                        {categories.map(cat => (
                            <Menu.Item key={cat.label} onPress={() => { setCategory(cat); setCategoryMenu(false); }} title={cat.label} />
                        ))}
                    </Menu>
                    <Menu
                        visible={paymentMenu}
                        onDismiss={() => setPaymentMenu(false)}
                        anchor={
                            <TouchableOpacity style={[styles.pill, { backgroundColor: '#f3f3f3' }]} onPress={() => setPaymentMenu(true)}>
                                <IconButton icon={payment.icon} size={18} />
                                <Text>{payment.label}</Text>
                            </TouchableOpacity>
                        }
                    >
                        {paymentTypes.map(pay => (
                            <Menu.Item key={pay.label} onPress={() => { setPayment(pay); setPaymentMenu(false); }} title={pay.label} />
                        ))}
                    </Menu>
                </View>
                <Text style={styles.amountText}>${amount || '0.00'}</Text>
                <View style={styles.keypadRow}>
                    {[1, 2, 3].map(n => (
                        <TouchableOpacity key={n} style={styles.keypadBtn} onPress={() => handleKeypad(n.toString())}>
                            <RNText style={styles.keypadText}>{n}</RNText>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.keypadRow}>
                    {[4, 5, 6].map(n => (
                        <TouchableOpacity key={n} style={styles.keypadBtn} onPress={() => handleKeypad(n.toString())}>
                            <RNText style={styles.keypadText}>{n}</RNText>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.keypadRow}>
                    {[7, 8, 9].map(n => (
                        <TouchableOpacity key={n} style={styles.keypadBtn} onPress={() => handleKeypad(n.toString())}>
                            <RNText style={styles.keypadText}>{n}</RNText>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.keypadRow}>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => handleKeypad('$')}>
                        <RNText style={styles.keypadText}>$</RNText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => handleKeypad('0')}>
                        <RNText style={styles.keypadText}>0</RNText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => handleKeypad('.')}>
                        <RNText style={styles.keypadText}>.</RNText>
                    </TouchableOpacity>
                </View>
                <View style={styles.keypadRow}>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => setShowDatePicker(true)}>
                        <IconButton icon="calendar" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.keypadBtn, { backgroundColor: theme.colors.primary }]} onPress={handleSubmit}>
                        <IconButton icon="check" size={20} style={{ margin: 0 }} iconColor="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.keypadBtn} onPress={() => setAmount(amount.slice(0, -1))}>
                        <IconButton icon="backspace" size={20} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateChange}
                    />
                )}
                <TextInput
                    style={styles.commentInput}
                    placeholder="Add comment..."
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    numberOfLines={2}
                />
                {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
                <Button mode="text" onPress={onClose} style={{ marginTop: 12 }}>Cancel</Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: 100,
    },
    pillsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        gap: 12,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
    },
    amountText: {
        fontSize: 40,
        fontWeight: 'bold',
        marginVertical: 16,
        textAlign: 'center',
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 2,
    },
    keypadBtn: {
        width: 64,
        height: 64,
        borderRadius: 12,
        backgroundColor: '#f3f3f3',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 6,
        marginVertical: 4,
    },
    keypadText: {
        fontSize: 24,
        fontWeight: '500',
    },
    dateText: {
        fontSize: 16,
        color: '#888',
        marginTop: 8,
    },
    commentInput: {
        fontSize: 16,
        color: '#333',
        width: '100%',
        minHeight: 48,
        backgroundColor: '#f3f3f3',
        borderRadius: 12,
        marginTop: 16,
        padding: 8,
    },
}); 