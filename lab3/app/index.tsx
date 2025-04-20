import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "react-native";

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
        <StatusBar style="auto" />
        <Text>init app</Text>
    </SafeAreaProvider>
  );
};

export default App;
