import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getItems } from "../DBQueries";
import {
  VictoryPie,
  VictoryLabel,
  VictoryChart,
  VictoryBar,
} from "victory-native";
import { useRecoilState } from "recoil";
import { itemState } from "../Recoil/atoms";
import { DataTable } from "react-native-paper";
import { getWeeklyTotals, getMonthlyTotals } from "../Utilities/totals";

const Graph = () => {
  const [Items, setItems] = useRecoilState(itemState);
  const [CategorisedItems, setCategorisedItems] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [graphType, setGraphType] = useState("category");
  const [Refresh, setRefresh] = useState(false);
  useEffect(() => {
    getItems(setItems);
  }, []);
  useEffect(() => {
    if (Items.length > 0) {
      let expenseCategoryMap = {};
      Items.map((item) => {
        item.data.map((it) => {
          if (!expenseCategoryMap[it.expenseCategory]) {
            expenseCategoryMap[it.expenseCategory] = parseFloat(it.amount);
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
      setWeeklyData(getWeeklyTotals(Items));
      setRefresh(!Refresh);
      console.log(pieData);
    }
  }, [Items]);

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View
        style={{
          backgroundColor: "white",
        }}
      >
        <View
          style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 5 }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: graphType === "category" ? "green" : "white",
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              borderWidth: 0.3,
              borderColor: "green",
            }}
            onPress={() => {
              setGraphType("category");
            }}
          >
            <Text
              style={{
                color: graphType === "category" ? "white" : "black",
              }}
            >
              Category
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginRight: 10,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: graphType === "weekly" ? "green" : "white",
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              borderWidth: 0.3,
              borderColor: "green",
            }}
            onPress={() => {
              setGraphType("weekly");
            }}
          >
            <Text
              style={{
                color: graphType === "weekly" ? "white" : "black",
              }}
            >
              Weekly
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View
            style={{
              marginTop: 10,
            }}
          >
            {graphType === "weekly" ? (
              <VictoryChart domainPadding={30}>
                <VictoryBar
                  style={{ data: { fill: "#c43a31" } }}
                  data={weeklyData}
                />
              </VictoryChart>
            ) : (
              <VictoryPie
                width={280}
                data={CategorisedItems}
                innerRadius={60}
                colorScale={"qualitative"}
                padAngle={1}
                labels={CategorisedItems.map((item) => `${item.x}\n${item.y}`)}
                labelComponent={
                  <VictoryLabel
                    textAnchor={"middle"}
                    labelPlacement={"parallel"}
                  />
                }
              />
            )}
          </View>
        </View>
      </View>
      <DataTable
        style={{
          width: "90%",
          alignSelf: "center",
          borderWidth: 1,
          borderRadius: 5,
        }}
      >
        <DataTable.Header>
          <DataTable.Title>{graphType === 'weekly' ? 'Week' : 'Category'}</DataTable.Title>
          <DataTable.Title numeric>expense</DataTable.Title>
        </DataTable.Header>
        {(graphType === 'weekly' ? weeklyData : CategorisedItems).map((it) => {
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
