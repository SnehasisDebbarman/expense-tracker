import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { addItem } from "../DBQueries";

const AddExpense = ({ navigation }) => {
  const [text, setText] = useState(null);
  const [Amount, setAmount] = useState("");
  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [addBtnDisabled, setAddBtnActive] = useState(false);
  function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];
  }

  useEffect(() => {
    setAddBtnActive(text === null || text === "");
  }, [text]);
  return (
    <View>
      <View
      //   style={styles.flexRow}
      >
        <TextInput
          onChangeText={(text) => setText(text)}
          placeholder="Add expense"
          //   style={styles.input}
          value={text}
        />
        <TextInput
          onChangeText={(amount) => setAmount(amount)}
          placeholder="Add Amount"
          //   style={styles.input}
          value={Amount}
        />
        <TouchableOpacity
          disabled={addBtnDisabled}
          onPress={() => {
            addItem(text, Amount, forceUpdate);
            setText(null);
            setAmount(null);
            navigation.navigate("Home");
          }}
          style={{
            backgroundColor: addBtnDisabled ? "grey" : "rgba(255,0,0,0.8)",
            borderWidth: 3,
            borderColor: addBtnDisabled ? "grey" : "black",
            margin: 15,
            paddingHorizontal: 20,
            paddingVertical: 10,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "700",
              color: "white",
            }}
          >
            Add
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddExpense;
