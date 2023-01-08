import { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Home from "./Screens/Home";
import Settings from "./Screens/Settings";
import AddExpense from "./Screens/AddExpense";
import Graph from "./Screens/Graph";
import { Ionicons, Entypo } from "@expo/vector-icons";
import useFonts from "./hooks/useFonts";

import * as SplashScreen from "expo-splash-screen";

import { RecoilRoot, useRecoilState } from "recoil";

import { db, dropTable, createTable, getItems, clearData } from "./DBQueries";

import { itemState } from "./Recoil/atoms";

SplashScreen.preventAutoHideAsync();
const Tab = createBottomTabNavigator();
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        await useFonts();
        createTable();
        // dropTable();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);
  useEffect(() => {
    onLayoutRootView();
  }, [appIsReady]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );
  }
  return (
    <RecoilRoot>
      <NavigationContainer>
        <View style={{ paddingVerticle: 20, flex: 1 }}>
          <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === "Home") {
                  iconName = focused
                    ? "ios-information-circle"
                    : "ios-information-circle-outline";
                } else if (route.name === "Settings") {
                  iconName = focused ? "settings" : "settings-outline";
                } else if (route.name === "Graph") {
                  iconName = focused ? "add-circle" : "add-circle-outline";
                }

                // You can return any component that you like here!
                if (route.name === "Graph") {
                  return (
                    <Entypo name="circular-graph" size={size} color={color} />
                  );
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "tomato",
              tabBarInactiveTintColor: "gray",
            })}
          >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Graph" component={Graph} />
            <Tab.Screen name="Settings" component={Settings} />
          </Tab.Navigator>
        </View>
        <StatusBar style="auto" />
      </NavigationContainer>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
