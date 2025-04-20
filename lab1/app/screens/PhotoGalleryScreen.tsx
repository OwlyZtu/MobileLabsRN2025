import React, { useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_PHOTOS } from "@/data/mockData";
import { PhotoItem } from "@/types";
import PhotoCard from "@/components/photoGallery/PhotoCard";

const PhotoGalleryScreen: React.FC = () => {
  const handlePhotoPress = useCallback((item: PhotoItem) => {
    console.log("Photo item pressed:", item.id);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: PhotoItem }) => (
      <PhotoCard item={item} onPress={handlePhotoPress} />
    ),
    [handlePhotoPress]
  );

  const keyExtractor = useCallback((item: PhotoItem) => item.id, []);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <FlatList
        data={MOCK_PHOTOS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
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
    padding: 5,
  },
});

export default PhotoGalleryScreen;
