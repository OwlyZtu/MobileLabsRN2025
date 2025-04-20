import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "@/navigation/RootNavigator";

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      {/* <AuthProvider> */}
        <StatusBar style="auto" />
        <RootNavigator />
      {/* </AuthProvider> */}
    </SafeAreaProvider>
  );
};

export default App;
