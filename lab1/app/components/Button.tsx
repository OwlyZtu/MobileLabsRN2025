import React, { memo } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { darkTheme } from "@/constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const buttonStyle = [
    styles.button,
    type === "secondary" && styles.secondaryButton,
    type === "danger" && styles.dangerButton,
    disabled && styles.disabledButton,
    style,
  ];

  const titleStyle = [
    styles.title,
    type === "secondary" && styles.secondaryTitle,
    disabled && styles.disabledTitle,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            type === "secondary"
              ? darkTheme.colors.primary
              : darkTheme.colors.text
          }
        />
      ) : (
        <Text style={titleStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: darkTheme.borderRadius.md,
    backgroundColor: darkTheme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: darkTheme.spacing.lg,
    marginVertical: darkTheme.spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: darkTheme.colors.surface,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  dangerButton: {
    backgroundColor: darkTheme.colors.error,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: darkTheme.colors.surface,
  },
  title: {
    color: darkTheme.colors.text,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  secondaryTitle: {
    color: darkTheme.colors.textSecondary,
  },
  disabledTitle: {
    color: darkTheme.colors.textSecondary,
  },
});

export default memo(Button);
