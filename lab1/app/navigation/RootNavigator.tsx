import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import NewsScreen from "@/screens/NewsScreen";
import PhotoGalleryScreen from "@/screens/PhotoGalleryScreen";

export type RootTabParamList = {
  News: undefined;
  Gallery: undefined;
  Profile: undefined;
};

const Tab = createMaterialTopTabNavigator<RootTabParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
        tabBarStyle: { backgroundColor: "#ffffff" },
        tabBarIndicatorStyle: { backgroundColor: "#007AFF" },
        tabBarPressColor: "rgba(0, 122, 255, 0.1)",
      }}
    >
      <Tab.Screen name="News" component={NewsScreen} />
       <Tab.Screen name="Gallery" component={PhotoGalleryScreen} />
      {/*<Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
};

export default RootNavigator;
