import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import { useGameContext, Task } from "@/context/GameContext";

const getProgressColor = (percent: number) => {
  if (percent < 33) return "#FF4444";
  if (percent < 66) return "#FFBB33";
  return "#00C851";
};

export default function TasksScreen() {
  const { tasks, points } = useGameContext();

  const renderTaskItem = ({ item }: ListRenderItemInfo<Task>) => {
    const progressPercent = Math.min(100, (item.progress / item.target) * 100);

    return (
      <View style={styles.taskItem}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskName}>{item.name}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.completed ? "#4CAF50" : "#FFC107" },
            ]}
          >
            <Text style={styles.statusText}>
              {item.completed ? "COMPLETED" : "IN PROGRESS"}
            </Text>
          </View>
        </View>

        <Text style={styles.taskDescription}>{item.description}</Text>

        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${progressPercent}%`,
                backgroundColor: getProgressColor(progressPercent),
              },
            ]}
          />
        </View>

        <Text style={styles.progressText}>
          {item.progress} / {item.target}{" "}
          {item.type === "points" ? "points" : "times"}
        </Text>
      </View>
    );
  };

  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <Text style={styles.points}>{points} Points</Text>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Completed: {completedTasks} / {tasks.length} tasks
        </Text>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${(completedTasks / tasks.length) * 100}%`,
                backgroundColor: getProgressColor(
                  (completedTasks / tasks.length) * 100
                ),
              },
            ]}
          />
        </View>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  points: {
    fontSize: 18,
    fontWeight: "bold",
    color: "tomato",
  },
  summary: {
    padding: 16,
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 8,
  },
  taskItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  taskDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBar: {
    height: "100%",
  },
  progressText: {
    fontSize: 14,
    color: "#777",
    textAlign: "right",
  },
});
