import { View, Text, TouchableOpacity, Modal, Dimensions } from "react-native";
import React, { useState } from "react";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { Picker } from "@react-native-picker/picker";

const CustomPicker = ({ item, setItem, PickerList }) => {
  const [PickerModalVisible, setPickerModalVisible] = useState(false);
  return (
    <View>
      <TouchableOpacity onPress={() => setPickerModalVisible(true)}>
        <Text>{item}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={PickerModalVisible}
        onRequestClose={() => {
          setPickerModalVisible(false);
        }}
        style={{}}
      >
        <View
          style={{
            height: windowHeight,
            width: windowWidth,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Picker
            style={{
              backgroundColor: "white",
              borderWidth: 1,
              width: windowWidth * 0.8,
            }}
            selectedValue={item}
            onValueChange={(itemValue, itemIndex) => {
              setItem(itemValue);
              setPickerModalVisible(false);
            }}
          >
            {PickerList.map((item) => (
              <Picker.Item
                key={item.title}
                label={item.title}
                value={item.title}
              />
            ))}
          </Picker>
        </View>
      </Modal>
    </View>
  );
};

export default CustomPicker;
