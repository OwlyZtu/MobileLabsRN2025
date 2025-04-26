import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MemoryStatsProps {
  memoryStats: {
    totalSpace: number;
    freeSpace: number;
    usedSpace: number;
  };
}

const MemoryStats: React.FC<MemoryStatsProps> = ({ memoryStats }) => {
  const usedPercentage = (
    (memoryStats.usedSpace / memoryStats.totalSpace) *
    100
  ).toFixed(1);

  return (
    <View style={styles.memoryStatsContainer}>
      <Text style={styles.memoryStatsTitle}>Device Storage</Text>

      <View style={styles.memoryBarContainer}>
        <View style={[styles.memoryBarUsed, { width: `${usedPercentage}%` }]} />
      </View>

      <View style={styles.memoryStatsDetails}>
        <View style={styles.memoryStatItem}>
          <Text style={styles.memoryStatLabel}>Total</Text>
          <Text style={styles.memoryStatValue}>
            {memoryStats.totalSpace} GB
          </Text>
        </View>

        <View style={styles.memoryStatItem}>
          <Text style={styles.memoryStatLabel}>Free</Text>
          <Text style={styles.memoryStatValue}>{memoryStats.freeSpace} GB</Text>
        </View>

        <View style={styles.memoryStatItem}>
          <Text style={styles.memoryStatLabel}>Used</Text>
          <Text style={styles.memoryStatValue}>
            {memoryStats.usedSpace} GB ({usedPercentage}%)
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  memoryStatsContainer: {
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  memoryStatsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  memoryBarContainer: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  memoryBarUsed: {
    height: "100%",
    backgroundColor: "#4169E1",
    borderRadius: 5,
  },
  memoryStatsDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  memoryStatItem: {
    alignItems: "center",
  },
  memoryStatLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  memoryStatValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});

export default MemoryStats;
