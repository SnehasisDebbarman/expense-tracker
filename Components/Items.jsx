import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
} from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

function createSectionList(items) {
  const sections = {};

  items?.forEach((item) => {
    const key = moment(item.dateNow).format("dddd, do MMM YYYY");
    if (!sections[key]) {
      sections[key] = [];
    }
    sections[key].push(item);
  });

  return Object.keys(sections).map((key) => ({
    title: key,
    data: sections[key],
  }));
}

function Items({ db, done: doneHeading, forceUpdate }) {
  const [items, setItems] = useState(null);
  const [SectionedItems, setSectionedItems] = useState(null);
  useEffect(() => {
    let sections = createSectionList(items);
    setSectionedItems(sections);
  }, [items]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from items where done = ?;`,
        [doneHeading ? 1 : 0],
        (_, { rows: { _array } }) => setItems(_array)
      );
    });
  }, []);

  const heading = doneHeading ? "Completed" : "Todo";

  if (items === null || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <SectionList
        sections={SectionedItems}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => {
          const { id, done, value, amount, dateNow } = item;
          return (
            <TouchableOpacity
              key={id}
              style={{
                backgroundColor: done ? "#1c9963" : "#fff",
                borderColor: "#000",
                borderWidth: 1,
                padding: 8,
                margin: 5,
              }}
            >
              <Text style={{ color: done ? "#fff" : "#000" }}>{value}</Text>
              <Text>{amount}</Text>
              <TouchableOpacity
                onPress={() => {
                  db.transaction(
                    (tx) => {
                      tx.executeSql(`delete from items where id = ?;`, [id]);
                    },
                    null,
                    forceUpdate
                  );
                }}
              >
                <AntDesign name="delete" size={24} color="black" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    textAlign: "center",
    padding: 20,
    backgroundColor: "white",
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default Items;
