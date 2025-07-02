import CustomAddExpense from '@/src/components/CustomAddExpense';
import { addExpense } from '@/src/db/expenses';
import { globalEventEmitter } from '@/src/utils/EventEmitter';
import { useRouter } from 'expo-router';
import React from 'react';

export default function AddExpenseScreen() {
    const router = useRouter();

    const handleClose = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    const handleSubmit = async (expense: any) => {
        await addExpense(expense);
        globalEventEmitter.emit('expenseAdded');
        handleClose();
    };

    return (
        <CustomAddExpense
            visible={true}
            onClose={handleClose}
            onSubmit={handleSubmit}
        />
    );
} 