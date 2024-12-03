import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

const NotificationScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found");
        }

        // Fetch notifications for the logged-in user
        const response = await axios.get(
          `http://192.168.74.149:3000/notifications?userId=${userId}`
        );
        setNotifications(response.data);
      } catch (error) {
        // console.error("Error fetching notifications:", error);
        // Alert.alert(
        //   "Error",
        //   "Failed to fetch notifications. Please try again."
        // );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        item.read ? styles.readNotification : styles.unreadNotification,
      ]}
      onPress={() => {
        // Handle reading the notification
        // Mark notification as read
        markNotificationAsRead(item.id);
      }}
    >
      <Ionicons name="notifications-outline" size={24} color="#000" />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      <Text style={styles.notificationDate}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await axios.patch(
        `http://192.168.74.149:3000/notifications/${notificationId}`,
        {
          read: true,
        }
      );
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading notifications...</Text>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={64} color="#888" />
          <Text style={styles.emptyText}>No notifications yet.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotificationItem}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  notificationContent: {
    flex: 1,
    marginLeft: 10,
  },
  notificationTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#555",
  },
  notificationDate: {
    fontSize: 12,
    color: "#888",
  },
  readNotification: {
    backgroundColor: "#f9f9f9",
  },
  unreadNotification: {
    backgroundColor: "#e6f7ff",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    marginTop: 10,
  },
});

export default NotificationScreen;
