import React, { memo } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { PhotoItem } from "@/types";
import { darkTheme } from "@/constants/theme";

interface PhotoCardProps {
  item: PhotoItem;
  onPress?: (item: PhotoItem) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ item, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: darkTheme.spacing.xs,
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: darkTheme.colors.border,
  },
  content: {
    padding: darkTheme.spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: darkTheme.colors.text,
    marginBottom: darkTheme.spacing.xs,
  },
  description: {
    fontSize: 12,
    color: darkTheme.colors.textSecondary,
  },
});

export default memo(PhotoCard);
