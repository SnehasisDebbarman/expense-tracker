import React from 'react';
import { View } from 'react-native';
import { Card, IconButton, Text, useTheme } from 'react-native-paper';

/**
 * Display single expense item card
 * @param {{item:{id:number,expenseName:string,expenseCategory:string,subCategory:string,amount:string,currentTime:string},onEdit:Function,onDelete:Function}} props
 */
export default function ExpenseItem({ item, onEdit, onDelete }) {
  const theme = useTheme();
  return (
    <Card style={{ marginVertical: 4 }}>
      <Card.Title
        title={item.expenseName}
        subtitle={new Date(item.currentTime).toLocaleTimeString()}
        right={() => (
          <View style={{ flexDirection:'row' }}>
            <IconButton icon="pencil" size={18} onPress={() => onEdit && onEdit(item)} />
            <IconButton icon="delete" size={18} onPress={() => onDelete && onDelete(item)} />
          </View>
        )}
      />
      <Card.Content>
        <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
          <Text>{item.expenseCategory}{item.subCategory ? ` / ${item.subCategory}` : ''}</Text>
          <Text variant="titleMedium">₹{parseFloat(item.amount)}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}
