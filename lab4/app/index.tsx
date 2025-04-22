import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import ToDoList from "./(tabs)/ToDoList";

SplashScreen.preventAutoHideAsync();

type RootTabParamList = {
  ToDoList: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = focused
            ? route.name === "ToDoList"
              ? "list"
              : "list"
            : "list-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="ToDoList"
        component={ToDoList}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
