import * as SQLite from "expo-sqlite";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { itemState } from "../Recoil/atoms";
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
}
export function addItem(text, amount) {
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
    forceUpdate
  );
}
export function getItems(setItems) {
  // const [Items, setItems] = useRecoilState(itemState);
  // let items = [];
  db.transaction((tx) => {
    tx.executeSql(
      `select * from items;`,
      [],
      (_, { rows: { _array } }) => setItems(_array),
      (it) => console.log(it)
    );
  });
}
