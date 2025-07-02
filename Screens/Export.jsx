import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { exportExpensesToCSV } from '../Utilities/exportToCSV';

const Export = () => {
  const handleExport = async () => {
    try {
      await exportExpensesToCSV();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={handleExport}
        style={{ padding: 12, backgroundColor: 'green', borderRadius: 5 }}>
        <Text style={{ color: 'white' }}>Export to CSV</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Export;
