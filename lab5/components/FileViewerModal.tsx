import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FileViewerModalProps {
  visible: boolean;
  fileName: string;
  fileContent: string;
  editedContent: string;
  isEditMode: boolean;
  hasUnsavedChanges: boolean;
  onChangeContent: (text: string) => void;
  onToggleEditMode: () => void;
  onSave: () => void;
  onClose: () => void;
}

const FileViewerModal: React.FC<FileViewerModalProps> = ({
  visible,
  fileName,
  fileContent,
  editedContent,
  isEditMode,
  hasUnsavedChanges,
  onChangeContent,
  onToggleEditMode,
  onSave,
  onClose,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.fileViewerModalView}>
          <View style={styles.fileViewerHeader}>
            <Text style={styles.fileViewerTitle} numberOfLines={1}>
              {fileName} {hasUnsavedChanges ? "*" : ""}
            </Text>
            <View style={styles.fileViewerHeaderButtons}>
              {isEditMode && (
                <TouchableOpacity
                  style={[
                    styles.headerButton,
                    hasUnsavedChanges
                      ? styles.saveButtonActive
                      : styles.saveButtonInactive,
                  ]}
                  onPress={onSave}
                  disabled={!hasUnsavedChanges}
                >
                  <Ionicons
                    name="save-outline"
                    size={24}
                    color={hasUnsavedChanges ? "white" : "#cccccc"}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.headerButton}
                onPress={onToggleEditMode}
              >
                <Ionicons
                  name={isEditMode ? "eye-outline" : "create-outline"}
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {isEditMode ? (
            <TextInput
              style={styles.fileContentEdit}
              value={editedContent}
              onChangeText={onChangeContent}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />
          ) : (
            <ScrollView style={styles.fileContentScrollView}>
              {fileContent.length > 0 ? (
                <Text style={styles.fileContent}>{fileContent}</Text>
              ) : (
                <Text style={styles.emptyFileText}>This file is empty.</Text>
              )}
            </ScrollView>
          )}

          <View style={styles.fileViewerFooter}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>

            {isEditMode && (
              <TouchableOpacity
                style={[
                  styles.footerButton,
                  styles.saveButton,
                  !hasUnsavedChanges && styles.saveButtonDisabled,
                ]}
                onPress={onSave}
                disabled={!hasUnsavedChanges}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  fileViewerModalView: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    height: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  fileViewerHeader: {
    backgroundColor: "#4169E1",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fileViewerHeaderButtons: {
    flexDirection: "row",
  },
  headerButton: {
    marginLeft: 15,
  },
  saveButtonActive: {
    opacity: 1,
  },
  saveButtonInactive: {
    opacity: 0.5,
  },
  fileViewerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    flex: 1,
  },
  fileContentScrollView: {
    flex: 1,
    padding: 15,
  },
  fileContentEdit: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    textAlignVertical: "top",
    backgroundColor: "#F8F8F8",
  },
  fileContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  emptyFileText: {
    fontSize: 16,
    color: "#A9A9A9",
    textAlign: "center",
    marginTop: 20,
  },
  fileViewerFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  footerButton: {
    backgroundColor: "#4169E1",
    padding: 15,
    alignItems: "center",
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#32CD32",
  },
  saveButtonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default FileViewerModal;