import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { dropTable } from "../DBQueries";

const Settings = () => {
  return (
    <View
      style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
    >
      <TouchableOpacity onPress={() => dropTable()}>
        <Text>Clear all Data</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
