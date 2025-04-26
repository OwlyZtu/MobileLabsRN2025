import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FileItemProps {
  item: {
    name: string;
    path: string;
    isDirectory: boolean;
    size: number;
    modificationTime?: number;
  };
  onPress: (path: string) => void;
  onOpenFile: (path: string, name: string) => void;
  onDelete: (path: string, name: string, isDirectory: boolean) => void;
}

const FileItem: React.FC<FileItemProps> = ({ item, onPress, onOpenFile, onDelete }) => {
  const icon = item.isDirectory ? "folder" : "document-text-outline";
  const iconColor = item.isDirectory ? "#FFD700" : "#A9A9A9";
  const isTxtFile = !item.isDirectory && item.name.toLowerCase().endsWith(".txt");

  const fileExtension = item.isDirectory
    ? "Folder"
    : item.name.includes(".")
    ? item.name.split(".").pop()?.toUpperCase()
    : "Unknown";

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (timestamp?: number): string => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handlePress = () => {
    if (item.isDirectory) {
      onPress(item.path);
    } else if (isTxtFile) {
      onOpenFile(item.path, item.name);
    } else {
      Alert.alert(
        "File Details",
        `Name: ${item.name}\nType: ${fileExtension}\nSize: ${formatFileSize(
          item.size
        )}\nLast Modified: ${formatDate(item.modificationTime)}`,
        [{ text: "OK" }]
      );
    }
  };

  return (
    <TouchableOpacity style={styles.item} onPress={handlePress}>
      <View style={styles.itemContent}>
        <Ionicons
          name={isTxtFile ? "document-text" : icon}
          size={24}
          color={isTxtFile ? "#4169E1" : iconColor}
          style={styles.itemIcon}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemInfo}>
            {item.isDirectory ? "Folder" : fileExtension} • {formatFileSize(item.size)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteItemButton}
          onPress={() => onDelete(item.path, item.name, item.isDirectory)}
        >
          <Ionicons name="trash-outline" size={22} color="#FF6347" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "white",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemIcon: {
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  itemInfo: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  deleteItemButton: {
    padding: 8,
  },
});

export default FileItem;