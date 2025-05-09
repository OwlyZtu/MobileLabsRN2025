import React, { useState, useCallback } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/context/AuthContext";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "@/navigation/AuthNavigator";
import { darkTheme } from "@/constants/theme";

type RegisterScreenProps = StackScreenProps<AuthStackParamList, "Register">;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!name) newErrors.name = 'Name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [username, password, email, name]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await register({ username, password, email, name });
      
      if (!result.success && result.error) {
        setErrors({ form: result.error });
      }
    } finally {
      setIsLoading(false);
    }
  }, [username, password, email, name, validateForm, register]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.authContainer}>
        <Text style={styles.authTitle}>Create Account</Text>
        
        {errors.form && (
          <Text style={styles.formError}>{errors.form}</Text>
        )}
        
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
          
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            error={errors.email}
          />
          
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
            autoCapitalize="words"
            error={errors.name}
          />
          
          <Button
            title="Register"
            onPress={handleSubmit}
            disabled={isLoading}
            loading={isLoading}
            style={styles.submitButton}
          />
          <Button
            title="Already have an account? Login"
            onPress={() => navigation.navigate("Login")}
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
    backgroundColor: darkTheme.colors.background,
  },
  authContainer: {
    padding: darkTheme.spacing.md,
    flexGrow: 1,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: darkTheme.spacing.md,
    textAlign: "center",
    color: darkTheme.colors.text,
  },
  formContainer: {
    width: "100%",
  },
  submitButton: {
    marginBottom: darkTheme.spacing.md,
  },
  formError: {
    color: darkTheme.colors.error,
    textAlign: "center",
    marginBottom: darkTheme.spacing.md,
    backgroundColor: `${darkTheme.colors.error}20`,
    padding: darkTheme.spacing.sm,
    borderRadius: darkTheme.borderRadius.md,
  },
});

export default RegisterScreen;