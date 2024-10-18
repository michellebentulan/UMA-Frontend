import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import LearnCard from "../../components/LearnCard/LearnCard";

const LearnScreen: React.FC = () => {
  // Example data to display multiple Learn Cards
  const learnCardsData = [
    {
      title: "Best Practices for Livestock Health",
      department: "Department of Agriculture",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // YouTube video URL
      imageUrl: "",
      description:
        "Learn about maintaining livestock health with practical tips from experts.",
    },
    {
      title: "Understanding Animal Breeding",
      department: "Livestock Research Center",
      videoUrl: "",
      imageUrl: "https://via.placeholder.com/150", // Placeholder image URL
      description:
        "Explore the fundamentals of animal breeding for enhanced productivity.",
    },
    {
      title: "Feeding Livestock Efficiently",
      department: "Farming Institute",
      videoUrl: "",
      imageUrl: "",
      article:
        "This article dives deep into the best feeding practices for maximizing livestock growth.",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {learnCardsData.map((data, index) => (
          <LearnCard
            key={index}
            title={data.title}
            department={data.department}
            videoUrl={data.videoUrl}
            imageUrl={data.imageUrl}
            description={data.description}
            article={data.article}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 10,
  },
  scrollContainer: {
    paddingBottom: 20, // Adds extra padding at the bottom for scrolling
  },
});

export default LearnScreen;
