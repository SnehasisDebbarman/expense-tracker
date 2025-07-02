import { Expense, getAllExpenses, initDB } from '@/src/db/expenses';
import { globalEventEmitter } from '@/src/utils/EventEmitter';
import { useFocusEffect, useRouter } from 'expo-router';
import * as React from 'react';
import { Dimensions, FlatList, ScrollView, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Appbar, Button, Card, FAB, List, Menu, Text, ToggleButton } from 'react-native-paper';

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

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <Appbar.Header style={{ backgroundColor: '#fff', elevation: 0 }}>
        <Appbar.Content title="" />
        <Menu
          visible={monthMenuVisible}
          onDismiss={() => setMonthMenuVisible(false)}
          anchor={<Button onPress={() => setMonthMenuVisible(true)}>{months[selectedMonth]}</Button>}
        >
          {months.map((m, i) => (
            <Menu.Item key={m} onPress={() => { setSelectedMonth(i); setMonthMenuVisible(false); }} title={m} />
          ))}
        </Menu>
        <ToggleButton.Row
          onValueChange={v => setMode(v as 'expenses' | 'income')}
          value={mode}
        >
          <ToggleButton icon="trending-down" value="expenses" />
          <ToggleButton icon="trending-up" value="income" />
        </ToggleButton.Row>
      </Appbar.Header>
      <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 8 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold' }}>₹{totalBalance.toLocaleString()}</Text>
        <Text style={{ color: '#888', fontSize: 14 }}>Total Balance</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
        <Card style={{ flex: 1, margin: 4, borderRadius: 16, backgroundColor: '#fff', elevation: 1 }}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Day</Text>
            <Text style={{ fontSize: 18, color: '#007AFF' }}>₹{dayTotal.toLocaleString()}</Text>
          </Card.Content>
        </Card>
        <Card style={{ flex: 1, margin: 4, borderRadius: 16, backgroundColor: '#fff', elevation: 1 }}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Week</Text>
            <Text style={{ fontSize: 18, color: '#34C759' }}>₹{weekTotal.toLocaleString()}</Text>
          </Card.Content>
        </Card>
        <Card style={{ flex: 1, margin: 4, borderRadius: 16, backgroundColor: '#fff', elevation: 1 }}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Month</Text>
            <Text style={{ fontSize: 18, color: '#FF9500' }}>₹{totalBalance.toLocaleString()}</Text>
          </Card.Content>
        </Card>
      </View>
      <ScrollView>
        {expenses.length > 0 && chartData.labels.length > 0 && (
          <BarChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={220}
            yAxisLabel="₹"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '6', strokeWidth: '2', stroke: '#007AFF' },
            }}
            style={{ marginVertical: 8, borderRadius: 16, alignSelf: 'center' }}
          />
        )}
        {expenses.length === 0 && !loading ? (
          <Text style={{ margin: 16 }}>No expenses yet.</Text>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={item => item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <List.Item
                title={`${item.category}: ₹${item.amount}`}
                description={`${item.date} - ${item.notes}`}
                left={props => <List.Icon {...props} icon="currency-inr" />}
                onPress={() => router.push(`/edit-expense?id=${item.id}`)}
              />
            )}
          />
        )}
      </ScrollView>
      <FAB
        icon="plus"
        style={{ position: 'absolute', right: 16, bottom: 16 }}
        onPress={() => router.push('/(tabs)/add-expense')}
        label="Add"
      />
    </View>
  );
}
