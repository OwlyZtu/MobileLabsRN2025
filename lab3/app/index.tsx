import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import TasksScreen from "@/screens/TasksScreen";
import { GameProvider } from "@/context/GameContext";

type RootTabParamList = {
  Counter: undefined;
  Tasks: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <GameProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = focused
              ? route.name === "Counter"
                ? "game-controller"
                : "list"
              : route.name === "Counter"
              ? "game-controller-outline"
              : "list-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Tasks"
          component={TasksScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </GameProvider>
  );
}
