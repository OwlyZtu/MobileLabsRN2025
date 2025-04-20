import React, { useState, useCallback } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "@/navigation/AuthNavigator";

type LoginScreenProps = StackScreenProps<AuthStackParamList, "Login">;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [username, password]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await login({ username, password });

      if (!result.success && result.error) {
        setErrors({ form: result.error });
      }
    } finally {
      setIsLoading(false);
    }
  }, [username, password, validateForm, login]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.authContainer}>
        <Text style={styles.authTitle}>Welcome Back</Text>

        {errors.form && <Text style={styles.formError}>{errors.form}</Text>}

        <View style={styles.formContainer}>
          <Input
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            error={errors.username}
          />
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            error={errors.password}
          />
          <Button
            title="Login"
            onPress={handleSubmit}
            disabled={isLoading}
            loading={isLoading}
            style={styles.submitButton}
          />
          <Button
            title="Don't have an account? Register"
            onPress={() => navigation.navigate("Register")}
            type="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  authContainer: {
    padding: 20,
    flexGrow: 1,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  submitButton: {
    marginBottom: 15,
  },
  formError: {
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 15,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    padding: 10,
    borderRadius: 8,
  },
});

export default LoginScreen;
