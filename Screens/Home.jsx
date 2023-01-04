import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  SectionList,
  FlatList,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { db, dropTable, createTable, getItems, addItem } from "../DBQueries";
import { useRecoilState } from "recoil";
import { itemState } from "../Recoil/atoms";
import { FAB } from "react-native-paper";
import moment from "moment";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const Home = () => {
  const [Refreshing, setRefreshing] = useState(false);
  const [items, setitems] = useRecoilState(itemState);
  const [expense, setExpense] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [ExpenseName, setExpenseName] = useState("");
  const [ExpenseValue, setExpenseValue] = useState(0);
  useEffect(() => {
    getItems(setitems);
  }, []);
  useEffect(() => {
    TotalExpense(items);
  }, [items]);
  function TotalExpense(items, timePeriod = 0) {
    let expense = 0;
    if (items) {
      items?.forEach((it) => {
        let am = isNaN(parseFloat(it.amount)) ? 0 : parseFloat(it.amount);
        console.log(am);
        expense += am;
      });
    }
    setExpense(expense);
  }

  function AddExpense() {
    console.log(ExpenseName, ExpenseValue);
    addItem(ExpenseName, ExpenseValue);
    setModalVisible(!modalVisible);
    setTimeout(() => {
      getItems(setitems);
    }, 1000);
  }

  return (
    <View
      style={{
        height: windowHeight,
        width: windowWidth,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
      }}
    >
      <Pressable
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ fontSize: 35 }}>+</Text>
      </Pressable>
      <Text>Total Expenses</Text>
      <Text style={{ fontSize: 60 }}>
        <Text style={{ fontSize: 40, paddingLeft: 10, color: "grey" }}>₹</Text>
        {expense}
      </Text>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={Refreshing}
            onRefresh={() => {
              getItems(setitems);
            }}
          />
        }
        style={{ zIndex: 1 }}
        data={items}
        renderItem={(item) => {
          const { id, amount, dateNow, expenseName } = item.item;
          return (
            <View
              key={`expense-item-key-${id}`}
              style={{
                backgroundColor: "white",
                zIndex: 1,
                borderWidth: 2,
                width: windowWidth * 0.9,
                marginBottom: 5,
                padding: 15,
                borderRadius: 5,
                flexDirection: "row",
              }}
            >
              <View style={{ width: windowWidth * 0.35 }}>
                <Text style={{ fontSize: 18, paddingBottom: 5 }}>
                  {expenseName}
                </Text>
                <Text style={{ color: "grey" }}>
                  {moment(dateNow).format("hh:mm a")}
                </Text>
              </View>
              <View style={{ width: windowWidth * 0.45, alignSelf: "center" }}>
                <Text style={{ fontSize: 25, textAlign: "right" }}>
                  <Text
                    style={{ fontSize: 15, paddingLeft: 10, color: "grey" }}
                  >
                    ₹
                  </Text>
                  {isNaN(parseFloat(amount)) ? 0 : parseFloat(amount)}
                </Text>
              </View>
            </View>
          );
        }}
      ></FlatList>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <TouchableOpacity
            style={{
              height: windowHeight,
              width: windowWidth,
            }}
            onPressOut={() => {
              setModalVisible(false);
            }}
          >
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, paddingLeft: 10 }}>note</Text>
                <TextInput
                  onChangeText={(text) => setExpenseName(text)}
                  style={{
                    width: windowWidth * 0.7,
                    borderRadius: 10,
                    margin: 10,
                    fontSize: 20,
                    padding: 10,
                    minWidth: 80,
                    backgroundColor: "rgba(0,0,0,0.1)",
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 20,
                }}
              >
                <Text style={{ fontSize: 40, paddingLeft: 10 }}>₹</Text>
                <TextInput
                  onChangeText={(text) => setExpenseValue(text)}
                  keyboardType="numeric"
                  style={{
                    borderBottomWidth: 1,
                    minWidth: 80,
                    fontSize: 50,
                    padding: 5,
                  }}
                />
              </View>
              <Pressable
                style={{
                  width: windowWidth * 0.4,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 2,
                }}
                onPress={AddExpense}
              >
                <Text>Add</Text>
              </Pressable>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  fab: {
    zIndex: 10,
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 100,
    borderRadius: 70,
    height: 70,
    width: 70,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  modalView: {
    borderWidth: 2,
    marginTop: 100,
    height: "90%",
    marginHorizontal: 3,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default Home;
