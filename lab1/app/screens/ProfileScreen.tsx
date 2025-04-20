import React, { useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { AuthStackParamList } from "@/navigation/AuthNavigator";

type ProfileScreenProps = MaterialTopTabScreenProps<
  AuthStackParamList,
  "Profile"
>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  if (!user) {
    setTimeout(() => navigation.navigate("Login"), 3000);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.profileContainer}>
        <Image
          source={{
            uri: user?.profileImage || "https://via.placeholder.com/150",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.name}</Text>
        <Text style={styles.profileUsername}>@{user?.username}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            type="danger"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileContainer: {
    padding: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileUsername: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: "#888",
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  logoutButton: {
    width: "100%",
  },
});

export default ProfileScreen;
