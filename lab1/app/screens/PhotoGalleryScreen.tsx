import React, { useCallback, useState, useEffect } from "react";
import { FlatList, StyleSheet, ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PhotoItem } from "@/types";
import PhotoCard from "@/components/photoGallery/PhotoCard";
import { darkTheme } from "@/constants/theme";

const PAGE_SIZE = 10;

const PhotoGalleryScreen: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${page}&limit=${PAGE_SIZE}`
      );
      const data = await response.json();
      
      const formattedPhotos: PhotoItem[] = data.map((item: any) => ({
        id: item.id,
        title: `Photo by ${item.author}`,
        url: item.download_url,
        description: `Original size: ${item.width}x${item.height}`,
        dateAdded: new Date().toISOString(),
      }));

      setPhotos(prev => [...prev, ...formattedPhotos]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  useEffect(() => {
    fetchPhotos();
  }, []);

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

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={darkTheme.colors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onEndReached={fetchPhotos}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  listContent: {
    padding: darkTheme.spacing.sm,
  },
  loaderContainer: {
    paddingVertical: darkTheme.spacing.lg,
    alignItems: 'center',
  },
});

export default PhotoGalleryScreen;
