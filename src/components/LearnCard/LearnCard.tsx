import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";

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
    <View style={styles.cardContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  department: {
    fontSize: 14,
    color: "#999",
  },
  mediaContainer: {
    height: 250,
    marginBottom: 10,
    overflow: "hidden",
  },
  video: {
    flex: 1,
  },
  image: {
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  textContent: {
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  article: {
    fontSize: 14,
    color: "#666",
  },
  readMore: {
    fontSize: 14,
    color: "#e91e63",
    fontWeight: "bold",
  },
});

export default LearnCard;
