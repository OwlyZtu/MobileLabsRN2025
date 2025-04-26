import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";

// Import components
import MemoryStats from "../../components/MemoryStats";
import Breadcrumb from "../../components/Breadcrumb";
import FileItem from "../../components/FileItem";
import NewFolderModal from "../../components/NewFolderModal";
import NewFileModal from "../../components/NewFileModal";
import FileViewerModal from "../../components/FileViewerModal";

// Import types
import {
  FileItem as FileItemType,
  MemoryStats as MemoryStatsType,
} from "../../types";

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [contents, setContents] = useState<FileItemType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pathHistory, setPathHistory] = useState<string[]>([]);

  const [newFolderModalVisible, setNewFolderModalVisible] =
    useState<boolean>(false);
  const [newFileModalVisible, setNewFileModalVisible] =
    useState<boolean>(false);
  const [fileViewerModalVisible, setFileViewerModalVisible] =
    useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFileContent, setNewFileContent] = useState<string>("");

  const [currentFileContent, setCurrentFileContent] = useState<string>("");
  const [editedFileContent, setEditedFileContent] = useState<string>("");
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const [currentFilePath, setCurrentFilePath] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [memoryStats, setMemoryStats] = useState<MemoryStatsType>({
    totalSpace: 0,
    freeSpace: 0,
    usedSpace: 0,
  });

  const BASE_DIR = FileSystem.documentDirectory + "AppData";

  useEffect(() => {
    setupBaseDirectory();
    getMemoryStats();
  }, []);

  const getMemoryStats = async () => {
    try {
      const fileSystemInfo = await FileSystem.getFreeDiskStorageAsync();
      const totalDiskCapacity = await FileSystem.getTotalDiskCapacityAsync();

      const usedSpace = totalDiskCapacity - fileSystemInfo;

      const totalSpaceGB = (totalDiskCapacity / (1024 * 1024 * 1024)).toFixed(
        2
      );
      const freeSpaceGB = (fileSystemInfo / (1024 * 1024 * 1024)).toFixed(2);
      const usedSpaceGB = (usedSpace / (1024 * 1024 * 1024)).toFixed(2);

      setMemoryStats({
        totalSpace: parseFloat(totalSpaceGB),
        freeSpace: parseFloat(freeSpaceGB),
        usedSpace: parseFloat(usedSpaceGB),
      });
    } catch (error) {
      console.error("Error getting memory stats:", error);
    }
  };

  const setupBaseDirectory = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(BASE_DIR);

      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(BASE_DIR, { intermediates: true });
        console.log("Created base directory:", BASE_DIR);
      }

      setCurrentPath(BASE_DIR);
      loadDirectoryContents(BASE_DIR);
    } catch (error) {
      Alert.alert("Error", "Failed to setup base directory: " + error.message);
      console.error("Error setting up base directory:", error);
    }
  };

  const loadDirectoryContents = async (directoryPath: string) => {
    setIsLoading(true);
    try {
      const result = await FileSystem.readDirectoryAsync(directoryPath);

      const contentsWithInfo = await Promise.all(
        result.map(async (name) => {
          const path = `${directoryPath}/${name}`;
          const info = await FileSystem.getInfoAsync(path);
          return {
            name,
            path,
            isDirectory: info.isDirectory,
            size: info.size,
            modificationTime: info.modificationTime,
          };
        })
      );

      const sortedContents = contentsWithInfo.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      setContents(sortedContents);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to load directory contents: " + error.message
      );
      console.error("Error loading directory contents:", error);
      setContents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToDirectory = (path: string) => {
    setPathHistory((prev) => [...prev, currentPath]);
    setCurrentPath(path);
    loadDirectoryContents(path);
  };

  const navigateUp = () => {
    if (pathHistory.length > 0) {
      const previousPath = pathHistory[pathHistory.length - 1];
      setPathHistory((prev) => prev.slice(0, -1));
      setCurrentPath(previousPath);
      loadDirectoryContents(previousPath);
    }
  };

  const createNewFolder = async () => {
    if (!newFolderName.trim()) {
      Alert.alert("Error", "Please enter a folder name");
      return;
    }

    try {
      const newFolderPath = `${currentPath}/${newFolderName.trim()}`;
      const folderInfo = await FileSystem.getInfoAsync(newFolderPath);

      if (folderInfo.exists) {
        Alert.alert("Error", "A folder with this name already exists");
        return;
      }

      await FileSystem.makeDirectoryAsync(newFolderPath);

      loadDirectoryContents(currentPath);

      setNewFolderName("");
      setNewFolderModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to create folder: " + error.message);
      console.error("Error creating folder:", error);
    }
  };

  const createNewTextFile = async () => {
    if (!newFileName.trim()) {
      Alert.alert("Error", "Please enter a file name");
      return;
    }

    try {
      let fileName = newFileName.trim();
      if (!fileName.toLowerCase().endsWith(".txt")) {
        fileName += ".txt";
      }

      const newFilePath = `${currentPath}/${fileName}`;
      const fileInfo = await FileSystem.getInfoAsync(newFilePath);

      if (fileInfo.exists) {
        Alert.alert("Error", "A file with this name already exists");
        return;
      }

      await FileSystem.writeAsStringAsync(newFilePath, newFileContent || "");

      loadDirectoryContents(currentPath);

      setNewFileName("");
      setNewFileContent("");
      setNewFileModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to create file: " + error.message);
      console.error("Error creating file:", error);
    }
  };

  const openTextFile = async (filePath: string, fileName: string) => {
    try {
      if (!fileName.toLowerCase().endsWith(".txt")) {
        Alert.alert("Info", "Only .txt files can be opened for viewing");
        return;
      }

      setIsLoading(true);

      const content = await FileSystem.readAsStringAsync(filePath);

      setCurrentFileContent(content);
      setEditedFileContent(content);
      setCurrentFileName(fileName);
      setCurrentFilePath(filePath);
      setFileViewerModalVisible(true);
      setIsEditMode(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      Alert.alert("Error", "Failed to open file: " + error.message);
      console.error("Error opening file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFileChanges = async () => {
    try {
      setIsLoading(true);

      await FileSystem.writeAsStringAsync(currentFilePath, editedFileContent);

      setCurrentFileContent(editedFileContent);
      setHasUnsavedChanges(false);

      Alert.alert("Success", "File saved successfully");

      loadDirectoryContents(currentPath);
    } catch (error) {
      Alert.alert("Error", "Failed to save file: " + error.message);
      console.error("Error saving file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (text: string) => {
    setEditedFileContent(text);
    setHasUnsavedChanges(text !== currentFileContent);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setEditedFileContent(currentFileContent);
      setHasUnsavedChanges(false);
    }
  };

  const handleCloseFileViewer = () => {
    if (isEditMode && hasUnsavedChanges) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Do you want to save before closing?",
        [
          {
            text: "Discard",
            onPress: () => setFileViewerModalVisible(false),
            style: "destructive",
          },
          {
            text: "Save",
            onPress: async () => {
              await saveFileChanges();
              setFileViewerModalVisible(false);
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      setFileViewerModalVisible(false);
    }
  };

  const deleteItem = (path: string, name: string, isDirectory: boolean) => {
    Alert.alert(
      `Delete ${isDirectory ? "Folder" : "File"}`,
      `Are you sure you want to delete "${name}"?${
        isDirectory ? " All contents will be permanently deleted." : ""
      }`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              await FileSystem.deleteAsync(path, { idempotent: true });
              loadDirectoryContents(currentPath);
              Alert.alert(
                "Success",
                `${isDirectory ? "Folder" : "File"} deleted successfully`
              );
            } catch (error) {
              Alert.alert(
                "Error",
                `Failed to delete ${isDirectory ? "folder" : "file"}: ${
                  error.message
                }`
              );
              console.error(
                `Error deleting ${isDirectory ? "folder" : "file"}:`,
                error
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const canNavigateUp = currentPath !== BASE_DIR && currentPath !== "";

  const handleCloseFolderModal = () => {
    setNewFolderName("");
    setNewFolderModalVisible(false);
  };

  const handleCloseFileModal = () => {
    setNewFileName("");
    setNewFileContent("");
    setNewFileModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>File Manager</Text>
      </View>

      <MemoryStats memoryStats={memoryStats} />
      <Breadcrumb currentPath={currentPath} />

      <View style={styles.contentContainer}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        ) : (
          <>
            {canNavigateUp && (
              <TouchableOpacity style={styles.upButton} onPress={navigateUp}>
                <Ionicons name="arrow-up" size={24} color="#4169E1" />
                <Text style={styles.upButtonText}>Up</Text>
              </TouchableOpacity>
            )}

            {contents.length === 0 ? (
              <View style={styles.emptyDirectory}>
                <Text style={styles.emptyText}>Empty Directory</Text>
              </View>
            ) : (
              <FlatList
                data={contents}
                renderItem={({ item }) => (
                  <FileItem
                    item={item}
                    onPress={navigateToDirectory}
                    onOpenFile={openTextFile}
                    onDelete={deleteItem}
                  />
                )}
                keyExtractor={(item) => item.path}
                style={styles.list}
              />
            )}
          </>
        )}
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setNewFolderModalVisible(true)}
        >
          <Ionicons name="folder-outline" size={22} color="white" />
          <Text style={styles.actionButtonText}>New Folder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setNewFileModalVisible(true)}
        >
          <Ionicons name="document-outline" size={22} color="white" />
          <Text style={styles.actionButtonText}>New File</Text>
        </TouchableOpacity>
      </View>

      <NewFolderModal
        visible={newFolderModalVisible}
        folderName={newFolderName}
        onChangeFolderName={setNewFolderName}
        onClose={handleCloseFolderModal}
        onCreate={createNewFolder}
      />

      <NewFileModal
        visible={newFileModalVisible}
        fileName={newFileName}
        fileContent={newFileContent}
        onChangeFileName={setNewFileName}
        onChangeFileContent={setNewFileContent}
        onClose={handleCloseFileModal}
        onCreate={createNewTextFile}
      />

      <FileViewerModal
        visible={fileViewerModalVisible}
        fileName={currentFileName}
        fileContent={currentFileContent}
        editedContent={editedFileContent}
        isEditMode={isEditMode}
        hasUnsavedChanges={hasUnsavedChanges}
        onChangeContent={handleContentChange}
        onToggleEditMode={toggleEditMode}
        onSave={saveFileChanges}
        onClose={handleCloseFileViewer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4169E1",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  upButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  upButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#4169E1",
  },
  list: {
    flex: 1,
  },
  emptyDirectory: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#A9A9A9",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4169E1",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  actionButtonText: {
    color: "white",
    marginLeft: 5,
    fontWeight: "500",
  },
});
