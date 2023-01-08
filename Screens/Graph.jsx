import { View, Text, FlatList, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { getItems } from "../DBQueries";
import { VictoryPie, VictoryContainer, VictoryLabel } from "victory-native";
import { useRecoilState } from "recoil";
import { itemState } from "../Recoil/atoms";
import { DataTable } from "react-native-paper";

const Graph = () => {
  const [Items, setItems] = useRecoilState(itemState);
  const [CategorisedItems, setCategorisedItems] = useState([]);
  useEffect(() => {
    getItems(setItems);
  }, []);
  useEffect(() => {
    if (Items.length > 0) {
      let expenseCategoryMap = {};
      Items.map((item) => {
        item.data.map((it) => {
          if (!expenseCategoryMap[it.expenseCategory]) {
            expenseCategoryMap[it.expenseCategory] = it.amount;
          } else {
            expenseCategoryMap[it.expenseCategory] =
              parseFloat(expenseCategoryMap[it.expenseCategory]) +
              parseFloat(it.amount);
          }
        });
      });

      let pieData = [];
      Object.keys(expenseCategoryMap).forEach((it) => {
        pieData.push({
          x: it,
          y: expenseCategoryMap[it],
        });
      });
      setCategorisedItems(pieData);
      console.log(pieData);
    }
  }, [Items]);

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View
        style={{
          backgroundColor: "white",
          alignItems: "center",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <VictoryPie
            animate={{
              duration: 2000,
            }}
            containerComponent={<VictoryContainer responsive={false} />}
            width={280}
            colorScale={["tomato", "orange", "gold", "cyan", "navy"]}
            data={CategorisedItems}
            padAngle={2}
            innerRadius={50}
            labelComponent={
              <VictoryLabel textAnchor={"middle"} labelPlacement={"parallel"} />
            }
          />
        </View>
      </View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Category</DataTable.Title>
          <DataTable.Title numeric>expense</DataTable.Title>
        </DataTable.Header>
        {CategorisedItems.map((it) => {
          return (
            <DataTable.Row key={`item-category-list-${it.x}`}>
              <DataTable.Cell>{it.x}</DataTable.Cell>
              <DataTable.Cell numeric>₹{it.y}</DataTable.Cell>
            </DataTable.Row>
          );
        })}
      </DataTable>
    </ScrollView>
  );
};

export default Graph;
