import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BreadcrumbProps {
  currentPath: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentPath }) => {
  const getRelativePath = () => {
    if (!currentPath) return "AppData";

    const pathParts = currentPath.split("AppData");
    if (pathParts.length > 1) {
      return "AppData" + pathParts[1];
    }
    return "AppData";
  };

  const relativePath = getRelativePath();
  const parts = relativePath.split("/").filter(Boolean);

  return (
    <View style={styles.breadcrumb}>
      {parts.map((part, index) => (
        <View key={index} style={styles.breadcrumbItem}>
          {index > 0 && <Text style={styles.breadcrumbSeparator}>/</Text>}
          <Text style={styles.breadcrumbText}>{part}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6E6FA",
    padding: 10,
    flexWrap: "wrap",
  },
  breadcrumbItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  breadcrumbText: {
    fontSize: 14,
    color: "#4169E1",
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: "#A9A9A9",
    marginHorizontal: 5,
  },
});

export default Breadcrumb;