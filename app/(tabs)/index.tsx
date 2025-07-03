import { Expense, getAllExpenses, initDB } from '@/src/db/expenses';
import { globalEventEmitter } from '@/src/utils/EventEmitter';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import * as React from 'react';
import { Dimensions, FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import type { MD3Theme as Theme } from 'react-native-paper';
import { Appbar, Button, Card, Menu, Text, ToggleButton, useTheme } from 'react-native-paper';

export default function DashboardScreen() {
  const router = useRouter();
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [mode, setMode] = React.useState<'expenses' | 'income'>('expenses');
  const [monthMenuVisible, setMonthMenuVisible] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth());
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const theme = useTheme();

  const loadExpenses = React.useCallback(() => {
    setLoading(true);
    getAllExpenses(data => {
      setExpenses(data);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    initDB();
    loadExpenses();
    globalEventEmitter.on('expenseAdded', loadExpenses);
    return () => {
      globalEventEmitter.off('expenseAdded', loadExpenses);
    };
  }, [loadExpenses]);

  useFocusEffect(
    React.useCallback(() => {
      loadExpenses();
    }, [loadExpenses])
  );

  // Filter expenses by selected month
  const filteredExpenses = React.useMemo(() => {
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === selectedMonth;
    });
  }, [expenses, selectedMonth]);

  // Calculate totals
  const totalBalance = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const today = new Date();
  const dayTotal = filteredExpenses.filter(exp => new Date(exp.date).toDateString() === today.toDateString()).reduce((sum, exp) => sum + exp.amount, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekTotal = filteredExpenses.filter(exp => {
    const d = new Date(exp.date);
    return d >= weekStart && d <= today;
  }).reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate totals per category for the chart
  const categoryTotals = React.useMemo(() => {
    const totals: { [category: string]: number } = {};
    expenses.forEach(exp => {
      if (!totals[exp.category]) totals[exp.category] = 0;
      totals[exp.category] += exp.amount;
    });
    return totals;
  }, [expenses]);

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
      },
    ],
  };

  // Category icon mapping
  const categoryIcons = {
    Shopping: 'shopping',
    Food: 'food',
    Gifts: 'gift',
    Bills: 'file-document',
    Travel: 'airplane',
    Other: 'dots-horizontal',
  };

  function ExpenseCard({ item, theme }: { item: Expense; theme: Theme }) {
    const isNegative = item.amount < 0;
    const formattedDate = new Date(item.date).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
    const iconName = (item.category && categoryIcons[item.category as keyof typeof categoryIcons]) || 'wallet';
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        marginVertical: 8,
        backgroundColor: theme.colors.surface,
        elevation: 2,
        padding: 0,
        overflow: 'visible',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      }}>
        {/* Icon */}
        <View style={{
          backgroundColor: theme.colors.primary + '22',
          borderRadius: 32,
          width: 48,
          height: 48,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 12,
        }}>
          <MaterialCommunityIcons
            name={iconName as any}
            size={28}
            color={theme.colors.primary}
          />
        </View>
        {/* Main content */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: theme.colors.onSurface }}>{item.notes || item.category}</Text>
          <Text style={{ color: theme.colors.outline, fontSize: 13, marginTop: 2 }}>{formattedDate}</Text>
        </View>
        {/* Amount and category capsule */}
        <View style={{ alignItems: 'flex-end', margin: 12, minWidth: 90 }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 16,
            color: isNegative ? theme.colors.error : theme.colors.primary,
          }}>
            {isNegative ? '-' : ''}₹{Math.abs(item.amount).toFixed(2)}
          </Text>
          <View style={{
            backgroundColor: theme.colors.primary,
            borderRadius: 999,
            paddingHorizontal: 12,
            paddingVertical: 2,
            marginTop: 6,
            alignSelf: 'flex-end',
          }}>
            <Text style={{ color: theme.colors.background, fontSize: 12 }}>{item.category}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface, elevation: 0 }}>
        <Appbar.Content title="" />
        <Menu
          visible={monthMenuVisible}
          onDismiss={() => setMonthMenuVisible(false)}
          anchor={<Button onPress={() => setMonthMenuVisible(true)} labelStyle={{ color: theme.colors.primary }}>{months[selectedMonth]}</Button>}
        >
          {months.map((m, i) => (
            <Menu.Item key={m} onPress={() => { setSelectedMonth(i); setMonthMenuVisible(false); }} title={m} titleStyle={{ color: theme.colors.onSurface }} />
          ))}
        </Menu>
        <ToggleButton.Row
          onValueChange={v => setMode(v as 'expenses' | 'income')}
          value={mode}
        >
          <ToggleButton icon="trending-down" value="expenses" style={{ backgroundColor: mode === 'expenses' ? theme.colors.primary : theme.colors.surface }} iconColor={mode === 'expenses' ? theme.colors.background : theme.colors.onSurface} />
          <ToggleButton icon="trending-up" value="income" style={{ backgroundColor: mode === 'income' ? theme.colors.primary : theme.colors.surface }} iconColor={mode === 'income' ? theme.colors.background : theme.colors.onSurface} />
        </ToggleButton.Row>
      </Appbar.Header>
      <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 8 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: theme.colors.onSurface }}>₹{totalBalance.toLocaleString()}</Text>
        <Text style={{ color: theme.colors.outline, fontSize: 14 }}>Total Balance</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
        <Card style={{ flex: 1, margin: 4, borderRadius: 16, backgroundColor: theme.colors.surface, elevation: 1 }}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: theme.colors.onSurface }}>Day</Text>
            <Text style={{ fontSize: 18, color: theme.colors.primary }}>₹{dayTotal.toLocaleString()}</Text>
          </Card.Content>
        </Card>
        <Card style={{ flex: 1, margin: 4, borderRadius: 16, backgroundColor: theme.colors.surface, elevation: 1 }}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: theme.colors.onSurface }}>Week</Text>
            <Text style={{ fontSize: 18, color: '#34C759' }}>₹{weekTotal.toLocaleString()}</Text>
          </Card.Content>
        </Card>
        <Card style={{ flex: 1, margin: 4, borderRadius: 16, backgroundColor: theme.colors.surface, elevation: 1 }}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: theme.colors.onSurface }}>Month</Text>
            <Text style={{ fontSize: 18, color: '#FF9500' }}>₹{totalBalance.toLocaleString()}</Text>
          </Card.Content>
        </Card>
      </View>
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        {expenses.length > 0 && chartData.labels.length > 0 && (
          <BarChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={220}
            yAxisLabel="₹"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => theme.colors.primary,
              labelColor: (opacity = 1) => theme.colors.onSurface,
              style: { borderRadius: 16 },
              propsForDots: { r: '6', strokeWidth: '2', stroke: theme.colors.primary },
              propsForBackgroundLines: { stroke: theme.colors.outline },
            }}
            style={{ marginVertical: 8, borderRadius: 16, alignSelf: 'center', backgroundColor: theme.colors.surface }}
          />
        )}
        {expenses.length === 0 && !loading ? (
          <Text style={{ margin: 16, color: theme.colors.onSurface }}>No expenses yet.</Text>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={item => item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => router.push(`/edit-expense?id=${item.id}`)}>
                <ExpenseCard item={item} theme={theme} />
              </TouchableOpacity>
            )}
            style={{ backgroundColor: theme.colors.background }}
          />
        )}
      </ScrollView>
    </View>
  );
}
