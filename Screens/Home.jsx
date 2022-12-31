import { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SectionList,
  FlatList,
} from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import Items from "../Components/Items";

function dropTable(db, tableName) {
  db.transaction((tx) => {
    tx.executeSql(
      `DROP TABLE ${tableName}`,
      [],
      (_, result) => {
        console.log(`Dropped table ${tableName}`);
      },
      (err) => {
        console.error(`Error dropping table ${tableName}: ${err.message}`);
      }
    );
  });
}

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

export default function Home() {
  const [text, setText] = useState(null);
  const [Amount, setAmount] = useState("");
  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [addBtnDisabled, setAddBtnActive] = useState(false);
  useEffect(() => {
    setAddBtnActive(text === null || text === "");
  }, [text]);

  useEffect(() => {
    // dropTable(db, "items");
    const sql = `
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    expenseName TEXT NOT NULL,
    amount TEXT NOT NULL,
    dateNow DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

    db.transaction((tx) => {
      tx.executeSql(
        sql,
        [],
        (_, result) => {
          console.log(`Created table "items"`);
        },
        (err) => {
          console.error(`Error creating table "items": ${err.message}`);
        }
      );
    });
  }, []);

  const add = (text, amount) => {
    // is text empty?
    if (text === null || text === "" || amount === null) {
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into items (done, expenseName, amount) values (0, ?, ?)",
          [text, amount],
          (_, result) => {
            console.log(`Inserted row with ID: ${result.insertId}`);
          },
          (err) => {
            console.error(`Error inserting row: ${err.message}`);
          }
        );
        tx.executeSql(
          "select * from items",
          [],
          (_, { rows }) => {
            console.log(`Retrieved rows: ${JSON.stringify(rows)}`);
          },
          (err) => {
            console.error(`Error retrieving rows: ${err.message}`);
          }
        );
      },
      (err) => {
        console.error(`Transaction error: ${err.message}`);
      },
      forceUpdate
    );
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.heading}>
            Expo SQlite is not supported on web!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.flexRow}>
            <TextInput
              onChangeText={(text) => setText(text)}
              placeholder="Add expense"
              style={styles.input}
              value={text}
            />
            <TextInput
              onChangeText={(amount) => setAmount(amount)}
              placeholder="Add Amount"
              style={styles.input}
              value={Amount}
            />
            <TouchableOpacity
              disabled={addBtnDisabled}
              onPress={() => {
                console.log(Amount);
                add(text, Amount);
                setText(null);
                setAmount(null);
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
          <Items
            key={`forceupdate-todo-${forceUpdateId}`}
            forceUpdate={forceUpdate}
            db={db}
            Items={Items}
          />
        </>
      )}
    </View>
  );
}

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  flexRow: {
    flexDirection: "row",
  },
  input: {
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  listArea: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    paddingTop: 16,
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
