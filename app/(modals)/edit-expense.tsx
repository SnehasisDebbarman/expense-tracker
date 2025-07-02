import CustomAddExpense from '@/src/components/CustomAddExpense';
import { getExpenseById, updateExpense } from '@/src/db/expenses';
import { globalEventEmitter } from '@/src/utils/EventEmitter';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function EditExpenseScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [expense, setExpense] = useState<any>(null);

    useEffect(() => {
        if (id) {
            getExpenseById(Number(id)).then(exp => {
                setExpense(exp);
                setLoading(false);
            });
        }
    }, [id]);

    const handleClose = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    const handleSubmit = async (updated: any) => {
        if (!expense) return;
        await updateExpense({ ...expense, ...updated });
        globalEventEmitter.emit('expenseAdded');
        handleClose();
    };

    if (loading || !expense) return null;

    return (
        <CustomAddExpense
            visible={true}
            onClose={handleClose}
            onSubmit={handleSubmit}
            initialValues={expense}
        />
    );
} 