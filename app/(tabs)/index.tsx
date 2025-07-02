import { Expense, getAllExpenses, initDB } from '@/src/db/expenses';
import { globalEventEmitter } from '@/src/utils/EventEmitter';
import { useFocusEffect, useRouter } from 'expo-router';
import * as React from 'react';
import { Dimensions, FlatList, ScrollView, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Appbar, FAB, List, Text } from 'react-native-paper';

export default function DashboardScreen() {
  const router = useRouter();
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [loading, setLoading] = React.useState(true);

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
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Expense Dashboard" />
        <Appbar.Action icon="refresh" onPress={loadExpenses} />
      </Appbar.Header>
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
