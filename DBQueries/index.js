import * as SQLite from "expo-sqlite";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { itemState } from "../Recoil/atoms";
import { sectionsedList } from "../Utilities/sectionisedList";
import moment from "moment";
//open db
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

export const db = openDatabase();
//drop table
export function dropTable(tableName = "items") {
  db.transaction((tx) => {
    tx.executeSql(
      `DROP TABLE ${tableName}`,
      [],
      (_, result) => {
        createTable();
        console.log(`Dropped table ${tableName}`);
      },
      (err) => {
        console.error(`Error dropping table ${tableName}: ${err.message}`);
      }
    );
  });
}
//create table items
export function createTable() {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM sqlite_master WHERE type="table";',
      [],
      (_, { rows }) => {
        console.log(rows._array);
      }
    );
  });
  const sql = `
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    expenseName TEXT NOT NULL,
    expenseCategory TEXT NOT NULL,
    subCategory TEXT,
    amount TEXT NOT NULL,
    dateNow TEXT NOT NULL,
    currentTime TEXT NOT NULL
  );
  `;

  db.transaction((tx) => {
    tx.executeSql(sql, null, null, (err) => {
      {
        console.log("2", err);
      }
    });
  });
}
export function addItem(
  expenseName,
  amount = 0,
  expenseCategory = "others",
  subCategory = null
) {
  let currentDate = moment().format("D MMMM Y");
  let currentTime = new Date().toISOString();
  if (expenseName === null || expenseName === "") {
    expenseName = expenseCategory;
  }

  db.transaction(
    (tx) => {
      tx.executeSql(
        "insert into items (expenseName, amount, expenseCategory, dateNow, currentTime,subCategory) values ( ?, ?, ?, ?, ?, ?)",
        [
          expenseName,
          amount,
          expenseCategory,
          currentDate,
          currentTime,
          subCategory,
        ],
        (_, result) => {
          console.log(`Inserted row with ID: ${result.insertId}`);
          return true;
        },
        (err) => {
          console.error(`Error inserting row: ${err.message}`);
          return false;
        }
      );
    },
    (err) => {
      console.error(`Transaction error: ${err.message}`);
      return false;
    }
  );
}
export function deleteItem(id, forceUpdate) {
  db.transaction(
    (tx) => {
      tx.executeSql(`delete from items where id = ?;`, [id]);
    },
    null,
    () => {}
  );
}
export function clearData() {
  db.transaction(
    (tx) => {
      tx.executeSql(`delete from items `, []);
    },
    null,
    null
  );
}
export function getItems(setItems) {
  db.transaction((tx) => {
    tx.executeSql(
      `select * from items;`,
      [],
      (_, { rows: { _array } }) => {
        setItems(sectionsedList(_array));
      },
      null
    );
  });
}
