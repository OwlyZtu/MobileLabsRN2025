import React, { useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_NEWS } from "@/data/mockData";
import { NewsItem } from "@/types";
import NewsCard from "@/components/news/NewsCard";

const NewsScreen: React.FC = () => {
  const handleNewsPress = useCallback((item: NewsItem) => {
    console.log("News item pressed:", item.id);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: NewsItem }) => (
      <NewsCard item={item} onPress={handleNewsPress} />
    ),
    [handleNewsPress]
  );

  const keyExtractor = useCallback((item: NewsItem) => item.id, []);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <FlatList
        data={MOCK_NEWS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    padding: 10,
  },
});

export default NewsScreen;
