import React, { memo } from "react";
import { TextInput, StyleSheet, View, Text, TextInputProps } from "react-native";
import { darkTheme } from "@/constants/theme";

interface InputProps extends TextInputProps {
  onChangeText: (text: string) => void;
  error?: string;
}

const Input: React.FC<InputProps> = ({ value, onChangeText, error, ...rest }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={darkTheme.colors.textSecondary}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: darkTheme.spacing.md,
  },
  input: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.md,
    padding: darkTheme.spacing.md,
    color: darkTheme.colors.text,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  inputError: {
    borderColor: darkTheme.colors.error,
  },
  errorText: {
    color: darkTheme.colors.error,
    fontSize: 12,
    marginTop: darkTheme.spacing.xs,
    marginLeft: darkTheme.spacing.xs,
  },
});

export default memo(Input);
