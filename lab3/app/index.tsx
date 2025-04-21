import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TasksScreen from "@/screens/TasksScreen";
import { GameProvider } from "@/context/GameContext";
import GameScreen from "@/screens/GameScreen";

type RootTabParamList = {
  Game: undefined;
  Tasks: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = focused
                ? route.name === "Game"
                  ? "game-controller"
                  : "list"
                : route.name === "Game"
                ? "game-controller-outline"
                : "list-outline";
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen
            name="Game"
            component={GameScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Tasks"
            component={TasksScreen}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </GameProvider>
    </GestureHandlerRootView>
  );
}
