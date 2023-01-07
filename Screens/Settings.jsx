import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { dropTable, getItems, clearData } from "../DBQueries";
import { useRecoilState } from "recoil";
import { itemState } from "../Recoil/atoms";

const Settings = ({ navigation }) => {
  const [items, setitems] = useRecoilState(itemState);
  return (
    <View
      style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
    >
      <TouchableOpacity
        style={{
          borderWidth: 1,
          backgroundColor: "white",
          borderRadius: 5,
          padding: 10,
        }}
        onPress={() => {
          clearData();
          setTimeout(() => {
            getItems(setitems);
            navigation.navigate("Home");
          }, 1000);
        }}
      >
        <Text>Clear all Data</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
