import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import { useAuth } from "@/context/AuthContext";
import ProfileScreen from "@/screens/ProfileScreen";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#ffffff' }
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Profile" component={ProfileScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
