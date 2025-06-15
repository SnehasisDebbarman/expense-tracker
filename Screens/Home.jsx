import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  SectionList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { createTable, getItems, addItem, deleteItem } from "../DBQueries";
import { useRecoilState } from "recoil";
import { itemState } from "../Recoil/atoms";
import ExpenseItem from "../Components/ExpenseItem";
import { filterByMonth } from "../Utilities/filter";
import { FAB } from "react-native-paper";
import moment from "moment";
import DropDownPicker from "react-native-dropdown-picker";
import { Picker } from "@react-native-picker/picker";
import { expenseCategories } from "../Utilities/expenseNames";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Home = () => {
  const [Refreshing, setRefreshing] = useState(false);
  const [items, setitems] = useRecoilState(itemState);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [expense, setExpense] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [ExpenseName, setExpenseName] = useState("");
  const [ExpenseValue, setExpenseValue] = useState(0);
  const [ExpenseCategory, setExpenseCategory] = useState("Other");
  const [open, setOpen] = useState(false);
  const [subCategoryDropdownVisible, setSubCategoryDropdownVisible] =
    useState(false);
  const [subCategory, setSubCategory] = useState(null);

  const [subCategories, setSubCategories] = useState(null);
  useEffect(() => {
    let subcat = [];
    expenseCategories.filter((expenseCategory) => {
      if (expenseCategory.title === ExpenseCategory) {
        subcat = expenseCategory.subcategories.map((item) => {
          return { label: item, value: item };
        });
      }
    });
    setSubCategories(subcat);
  }, [ExpenseCategory]);

  useEffect(() => {
    getItems(setitems);
  }, []);
  useEffect(() => {
    const monthItems = filterByMonth(items, selectedMonth);
    setFilteredItems(monthItems);
    TotalExpense(monthItems);
  }, [items, selectedMonth]);
  function TotalExpense(data) {
    let expense = 0;
    if (data) {
      expense = data.reduce((acc, curr) => {
        return (
          acc +
          curr.data.reduce((subAcc, subCurr) => {
            return subAcc + parseFloat(subCurr.amount);
          }, 0)
        );
      }, 0);
    }
    setExpense(expense);
  }

  function AddExpense() {
    createTable();
    setTimeout(() => {
      addItem(ExpenseName, ExpenseValue, ExpenseCategory, subCategory);
      setModalVisible(!modalVisible);
    }, 500);

    setTimeout(() => {
      getItems((arr)=>{
        setitems(arr);
        setFilteredItems(filterByMonth(arr, selectedMonth));
      });
      setExpense(0);
      setExpenseCategory("Other");
      setSubCategories(null);
      setExpenseName("");
    }, 1000);
  }

  function handleDelete(expense) {
    deleteItem(expense.id);
    setTimeout(() => getItems((arr)=>{
      setitems(arr);
      setFilteredItems(filterByMonth(arr, selectedMonth));
    }), 300);
  }

  function handleEdit(expense) {
    // placeholder for future edit feature
  }
  function renderItem(item) {
    return (
      <ExpenseItem
        item={item}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <View
      style={{
        height: windowHeight,
        width: windowWidth,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        backgroundColor: "white",
      }}
    >
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      />
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: 10,
        }}
      >
        <Text>Total Expenses</Text>
        <Text style={{ fontSize: 60 }}>
          <Text style={{ fontSize: 40, paddingLeft: 10, color: "grey" }}>
            ₹
          </Text>
          {expense}
        </Text>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={(value)=>setSelectedMonth(value)}
          style={{width:200}}
        >
          {Array.from({length:12}).map((_,i)=>(
            <Picker.Item key={`month-${i}`} label={moment().month(i).format('MMM')} value={i} />
          ))}
        </Picker>
      </View>

      {items.length <= 0 && (
        <View>
          <Text>No entries</Text>
        </View>
      )}

      <SectionList
        sections={filteredItems}
        ListFooterComponent={<View style={{ height: 120 }}></View>}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => renderItem(item)}
        renderSectionHeader={(item) => {
          return (
            <View
              style={{
                justifyContent: "center",
                width: "100%",
                alignItems: "center",
                padding: 5,
                backgroundColor: "white",
              }}
            >
              <Text style={{}}>{item.section.date}</Text>
            </View>
          );
        }}
      />

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
                  zIndex: 10,
                  width: windowWidth * 0.95,
                  justifyContent: "space-around",
                }}
              >
                <View>
                  <Text style={{ paddingVertical: 5 }}>Category</Text>
                  <DropDownPicker
                    containerStyle={{
                      width: windowWidth * 0.4,
                    }}
                    schema={{
                      label: "title",
                      value: "title",
                    }}
                    open={open}
                    value={ExpenseCategory}
                    items={expenseCategories}
                    setOpen={setOpen}
                    setValue={setExpenseCategory}
                  />
                </View>
                <View>
                  <Text style={{ paddingVertical: 5 }}> Sub Category</Text>
                  <DropDownPicker
                    containerStyle={{
                      width: windowWidth * 0.4,
                    }}
                    open={subCategoryDropdownVisible}
                    value={subCategory}
                    items={subCategories}
                    setOpen={setSubCategoryDropdownVisible}
                    setValue={setSubCategory}
                  />
                </View>
              </View>

              {/* <DropDownPicker
                open={subCategoryDropdownVisible}
                value={subCategory}
                items={subCategories}
                setOpen={setSubCategoryDropdownVisible}
                setValue={setSubCategory}
              /> */}

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
