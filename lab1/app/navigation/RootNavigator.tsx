import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import NewsScreen from "@/screens/NewsScreen";
import PhotoGalleryScreen from "@/screens/PhotoGalleryScreen";
import AuthNavigator from "./AuthNavigator";
import { darkTheme } from "@/constants/theme";

export type RootTabParamList = {
  News: undefined;
  Gallery: undefined;
  Auth: undefined;
};

const Tab = createMaterialTopTabNavigator<RootTabParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { 
          fontSize: 12, 
          fontWeight: "bold",
          color: darkTheme.colors.text,
        },
        tabBarStyle: { 
          backgroundColor: darkTheme.colors.surface,
          borderTopColor: darkTheme.colors.border,
        },
        tabBarIndicatorStyle: { 
          backgroundColor: darkTheme.colors.primary,
        },
        tabBarPressColor: `${darkTheme.colors.primary}33`,
      }}
    >
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Gallery" component={PhotoGalleryScreen} />
      <Tab.Screen
        name="Auth"
        component={AuthNavigator}
        options={{ tabBarLabel: "Account" }}
      />
    </Tab.Navigator>
  );
};

export default RootNavigator;
