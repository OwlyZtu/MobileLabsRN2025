import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { LogLevel, OneSignal } from "react-native-onesignal";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import {
  cancelNotification,
  scheduleNotification,
} from "../utils/notifications";

const ONESIGNAL_APP_ID = Constants?.expoConfig?.extra?.oneSignalAppId;

interface Task {
  id: number;
  name: string;
  description: string;
  reminderTime: string;
  createdAt: string;
  notificationId?: string;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [reminderDate, setReminderDate] = useState<Date>(new Date());
  const [nextId, setNextId] = useState<number>(1);
  const [emptyStateAnimation, setEmptyStateAnimation] =
    useState<string>("bounce");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    const initOneSignal = async () => {
      try {
        OneSignal.initialize(ONESIGNAL_APP_ID);
        OneSignal.Debug.setLogLevel(LogLevel.Verbose);

        const permission = await OneSignal.Notifications.requestPermission(
          true
        );
        console.log("OneSignal Permission:", permission);

        if (permission) {
          await OneSignal.User.pushSubscription.optIn();
          console.log("Successfully subscribed to notifications");
        }

        OneSignal.Notifications.addEventListener(
          "foregroundWillDisplay",
          (event) => {
            console.log("Notification received:", event);
            event.preventDefault();
            event.notification.display();
          }
        );

        OneSignal.Notifications.addEventListener("click", (event) => {
          console.log("Notification clicked:", event);
        });
      } catch (error) {
        console.error("OneSignal initialization error:", error);
      }
    };

    initOneSignal();
    loadTasks();

    return () => {
      OneSignal.Notifications.clearAll();
    };
  }, []);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
      await AsyncStorage.setItem("nextId", nextId.toString());
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      const storedNextId = await AsyncStorage.getItem("nextId");

      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }

      if (storedNextId) {
        setNextId(parseInt(storedNextId));
      }
    } catch (error) {
      console.error("Error loading data", error);
      Alert.alert(
        "Oops!",
        "Failed to load your tasks. The gremlins in your phone are at it again!"
      );
    }
  };

  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks();
    }
  }, [tasks, nextId]);

  const addTask = async () => {
    if (!taskName.trim()) {
      Alert.alert("Task Name Required", "Please give your task a proper name!");
      return;
    }

    try {
      const id = nextId;

      const notificationId = await scheduleNotification({
        reminderTime: reminderDate,
        title: `Reminder: ${taskName}`,
        desc: taskDescription || "Time to complete this task!",
      });

      if (notificationId) {
        const newTask = {
          id,
          name: taskName,
          description: taskDescription,
          reminderTime: reminderDate.toISOString(),
          createdAt: new Date().toISOString(),
          notificationId,
        };

        setTasks([...tasks, newTask]);
        setNextId(nextId + 1);
        setTaskName("");
        setTaskDescription("");
        setReminderDate(new Date());
        setModalVisible(false);

        Alert.alert("Task Added!", "Your reminder has been scheduled.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      Alert.alert("Error", "Failed to add task. Please try again.");
    }
  };

  const deleteTask = (id: number): void => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const taskToDelete = tasks.find((task) => task.id === id);

          if (taskToDelete && taskToDelete.notificationId) {
            await cancelNotification(taskToDelete.notificationId);
          }

          setTasks(tasks.filter((task) => task.id !== id));

          Alert.alert("Task Deleted", "Task successfully deleted!");
        },
      },
    ]);
  };

  const openAddTaskModal = () => {
    setTaskName("");
    setTaskDescription("");

    const oneHourFromNow = new Date();
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
    setReminderDate(oneHourFromNow);

    setModalVisible(true);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setReminderDate(date);
    hideDatePicker();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const changeEmptyAnimation = () => {
    const animations = [
      "bounce",
      "flash",
      "jello",
      "pulse",
      "rubberBand",
      "shake",
      "swing",
      "tada",
    ];
    const randomIndex = Math.floor(Math.random() * animations.length);
    setEmptyStateAnimation(animations[randomIndex]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>To-Do Reminder</Text>
          <Text style={styles.subtitle}>Never forget your tasks again</Text>
        </View>

        {tasks.length === 0 ? (
          <Animatable.View
            animation={emptyStateAnimation}
            duration={1500}
            style={styles.emptyContainer}
            onAnimationEnd={changeEmptyAnimation}
          >
            <FontAwesome name="list-alt" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Your task list is empty</Text>
            <Text style={styles.emptySubtext}>
              Tap the "+" button to add some tasks
            </Text>
          </Animatable.View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Animatable.View
                animation="fadeIn"
                duration={500}
                style={styles.taskItem}
              >
                <View style={styles.taskContent}>
                  <Text style={styles.taskName}>{item.name}</Text>
                  {item.description ? (
                    <Text style={styles.taskDescription}>
                      {item.description}
                    </Text>
                  ) : null}
                  <Text style={styles.taskTime}>
                    <FontAwesome name="clock-o" size={14} color="#666" />{" "}
                    {formatDate(item.reminderTime)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteTask(item.id)}
                >
                  <FontAwesome name="trash-o" size={24} color="#ff6b6b" />
                </TouchableOpacity>
              </Animatable.View>
            )}
            contentContainerStyle={styles.listContainer}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={openAddTaskModal}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Task</Text>

              <TextInput
                style={styles.input}
                placeholder="Task Name"
                value={taskName}
                onChangeText={setTaskName}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description (optional)"
                value={taskDescription}
                onChangeText={setTaskDescription}
                multiline
              />

              <Text style={styles.dateLabel}>Reminder Time:</Text>

              <TouchableOpacity
                style={styles.dateDisplay}
                onPress={showDatePicker}
              >
                <FontAwesome name="calendar" size={18} color="#4a6fa5" />
                <Text style={styles.dateText}>
                  {reminderDate.toLocaleString()}
                </Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                minimumDate={new Date()}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.addButton2]}
                  onPress={addTask}
                >
                  <Text style={styles.buttonText}>Add Task</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "#4a6fa5",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "#e0e0e0",
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
  listContainer: {
    padding: 15,
  },
  taskItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  taskTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4a6fa5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  addButton2: {
    backgroundColor: "#4a6fa5",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
