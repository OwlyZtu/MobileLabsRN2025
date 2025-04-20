import React, { memo } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { NewsItem } from "@/types";
import { darkTheme } from "@/constants/theme";

interface NewsCardProps {
  item: NewsItem;
  onPress?: (item: NewsItem) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        {item.category && <Text style={styles.category}>{item.category}</Text>}
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>
          {item.date} | By {item.author}
        </Text>
        <Text style={styles.text} numberOfLines={3}>
          {item.content}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.colors.surface,
    borderRadius: darkTheme.borderRadius.md,
    marginBottom: darkTheme.spacing.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: darkTheme.colors.border,
  },
  content: {
    padding: darkTheme.spacing.md,
  },
  category: {
    fontSize: 12,
    color: darkTheme.colors.primary,
    fontWeight: "bold",
    marginBottom: darkTheme.spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: darkTheme.colors.text,
    marginBottom: darkTheme.spacing.xs,
  },
  date: {
    fontSize: 12,
    color: darkTheme.colors.textSecondary,
    marginBottom: darkTheme.spacing.sm,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: darkTheme.colors.text,
  },
});

export default memo(NewsCard);
