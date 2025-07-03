import React, { useState } from 'react';
import { Modal, Text as RNText, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
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
        else if (val === ',' || val === '₹') return;
        else setAmount(amount + val);
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
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.pillsRow}>
                    <Menu
                        visible={categoryMenu}
                        onDismiss={() => setCategoryMenu(false)}
                        anchor={
                            <TouchableOpacity style={[styles.pill, {
                                backgroundColor: theme.colors.surface, borderWidth: 2, borderColor: theme.colors.primary, paddingRight: 15,
                            }]} onPress={() => setCategoryMenu(true)}>
                                <IconButton icon={category?.icon || 'help'} size={12} iconColor={theme.colors.primary} />
                                <Text style={{ color: theme.colors.onSurface }}>{category ? category.label : 'Select Category'}</Text>
                            </TouchableOpacity>
                        }
                    >
                        {categories.map(cat => (
                            <Menu.Item key={cat.label} onPress={() => { setCategory(cat); setCategoryMenu(false); }} title={cat.label} titleStyle={{ color: theme.colors.onSurface }} />
                        ))}
                    </Menu>
                    <Menu
                        visible={paymentMenu}
                        onDismiss={() => setPaymentMenu(false)}
                        anchor={
                            <TouchableOpacity style={[styles.pill, {
                                backgroundColor: theme.colors.surface, borderWidth: 2, borderColor: theme.colors.primary, paddingRight: 20,
                            }]} onPress={() => setPaymentMenu(true)}>
                                <IconButton icon={payment.icon} size={12} iconColor={theme.colors.primary} />
                                <Text style={{ color: theme.colors.onSurface }}>{payment.label}</Text>
                            </TouchableOpacity>
                        }
                    >
                        {paymentTypes.map(pay => (
                            <Menu.Item key={pay.label} onPress={() => { setPayment(pay); setPaymentMenu(false); }} title={pay.label} titleStyle={{ color: theme.colors.onSurface, paddingRight: 20 }} />
                        ))}
                    </Menu>
                    <TouchableOpacity
                        style={[
                            styles.dateDisplay,
                            { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, paddingRight: 15 },
                        ]}
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.8}
                    >
                        <IconButton icon="calendar" size={12} iconColor={theme.colors.primary} />
                        <Text style={{ color: theme.colors.primary, fontFamily: 'SpaceMono-Regular', fontSize: 16 }}>
                            {date.toISOString().slice(0, 10)}
                        </Text>
                    </TouchableOpacity>
                    <Modal
                        visible={showDatePicker}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setShowDatePicker(false)}
                    >
                        <View style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View style={{
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                borderRadius: 16,
                                padding: 16,
                                width: '90%',
                                alignItems: 'center'
                            }}>
                                <Calendar
                                    onDayPress={day => {
                                        setDate(new Date(day.dateString));
                                        setShowDatePicker(false);
                                    }}
                                    markedDates={{
                                        [date.toISOString().slice(0, 10)]: { selected: true, selectedColor: theme.colors.primary }
                                    }}
                                    theme={{
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        calendarBackground: 'rgba(0,0,0,1)',
                                        textSectionTitleColor: '#b6c1cd',
                                        selectedDayBackgroundColor: theme.colors.primary,
                                        selectedDayTextColor: 'black',
                                        todayTextColor: theme.colors.primary,
                                        dayTextColor: theme.colors.primary,
                                        textDisabledColor: '#d9e1e8',
                                        arrowColor: theme.colors.primary,
                                        monthTextColor: theme.colors.primary,
                                        indicatorColor: theme.colors.primary,
                                    }}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
                <Text style={[styles.amountText, { color: theme.colors.primary }]}>₹{amount || '0.00'}</Text>
                {/* Themed Date Display and Picker Trigger */}

                <View style={styles.keypadRow}>
                    {[1, 2, 3].map(n => (
                        <TouchableOpacity key={n} style={[styles.keypadBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 2 }]} onPress={() => handleKeypad(n.toString())}>
                            <RNText style={[styles.keypadText, { color: theme.colors.primary }]}>{n}</RNText>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.keypadRow}>
                    {[4, 5, 6].map(n => (
                        <TouchableOpacity key={n} style={[styles.keypadBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 2 }]} onPress={() => handleKeypad(n.toString())}>
                            <RNText style={[styles.keypadText, { color: theme.colors.primary }]}>{n}</RNText>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.keypadRow}>
                    {[7, 8, 9].map(n => (
                        <TouchableOpacity key={n} style={[styles.keypadBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 2 }]} onPress={() => handleKeypad(n.toString())}>
                            <RNText style={[styles.keypadText, { color: theme.colors.primary }]}>{n}</RNText>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.keypadRow}>
                    <TouchableOpacity style={[styles.keypadBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 2 }]} onPress={() => setAmount(amount.slice(0, -1))}>
                        <IconButton icon="backspace" size={20} iconColor={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.keypadBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 2 }]} onPress={() => handleKeypad('0')}>
                        <RNText style={[styles.keypadText, { color: theme.colors.primary }]}>0</RNText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.keypadBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 2 }]} onPress={() => handleKeypad('.')}>
                        <RNText style={[styles.keypadText, { color: theme.colors.primary }]}>.</RNText>
                    </TouchableOpacity>
                </View>
                <View style={styles.keypadRow}>
                    <TouchableOpacity style={[styles.keypadBtn, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, borderWidth: 2, width: 72 * 3 }]} onPress={handleSubmit}>
                        <IconButton icon="check" size={20} style={{ margin: 0 }} iconColor={theme.colors.background} />
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={[styles.commentInput, { backgroundColor: theme.colors.surface, color: theme.colors.onSurface }]}
                    placeholder="Add comment..."
                    placeholderTextColor={theme.colors.outline}
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    numberOfLines={2}
                />
                {error ? <Text style={{ color: theme.colors.error, marginTop: 8 }}>{error}</Text> : null}
                <Button mode="text" onPress={onClose} style={{ marginTop: 12 }} labelStyle={{ color: theme.colors.primary }}>Cancel</Button>
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
        gap: 5,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 0,
        paddingRight: 5,
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
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 6,
        marginVertical: 4,
    },
    keypadText: {
        fontSize: 24,
        fontWeight: '500',
    },
    dateDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 0,
        borderWidth: 2,
        paddingHorizontal: 0,
        paddingVertical: 0,
        marginVertical: 0,
        marginBottom: 0,
        alignSelf: 'stretch',
        justifyContent: 'center',
        gap: 8,
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