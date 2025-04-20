import React, { memo } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { NewsItem } from "@/types";

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
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 15,
  },
  category: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "bold",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default memo(NewsCard);
