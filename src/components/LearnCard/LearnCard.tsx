import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";

interface LearnCardProps {
  title?: string;
  department?: string;
  videoUrl?: string;
  imageUrl?: string;
  description?: string;
  article?: string;
}

const LearnCard: React.FC<LearnCardProps> = ({
  title,
  department,
  videoUrl,
  imageUrl,
  description,
  article,
}) => {
  // Conditionally render based on the content available
  const hasVideo = !!videoUrl;
  const hasImage = !!imageUrl;
  const hasText = !!description || !!article;

  return (
    <LinearGradient
      colors={["#ffffff", "#f9f9f9"]}
      style={styles.cardContainer}
    >
      {/* Title Section */}
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {department && <Text style={styles.department}>{department}</Text>}
        </View>
      )}

      {/* Media Section (Video or Image) */}
      {hasVideo ? (
        <View style={styles.mediaContainer}>
          <WebView
            style={styles.video}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{ uri: videoUrl }}
          />
        </View>
      ) : hasImage ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : null}

      {/* Description or Article Section */}
      {hasText && (
        <View style={styles.textContent}>
          {description && <Text style={styles.description}>{description}</Text>}
          {article && <Text style={styles.article}>{article}</Text>}
        </View>
      )}

      {/* Read More Button */}
      {hasText && (
        <TouchableOpacity>
          <Text style={styles.readMore}>Read More →</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    padding: 15,
    marginBottom: 20,
    elevation: 5, // Adds depth on Android
  },
  header: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 5,
  },
  department: {
    fontSize: 14,
    fontWeight: "500",
    color: "#95a5a6",
  },
  mediaContainer: {
    height: 240,
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  video: {
    flex: 1,
  },
  image: {
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  textContent: {
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#7f8c8d",
  },
  article: {
    fontSize: 16,
    lineHeight: 22,
    color: "#7f8c8d",
  },
  readMore: {
    fontSize: 16,
    color: "#e91e63",
    fontWeight: "600",
    marginTop: 10,
  },
});

export default LearnCard;
