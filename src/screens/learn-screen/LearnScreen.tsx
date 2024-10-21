import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import LearnCard from "../../components/LearnCard/LearnCard";

const LearnScreen: React.FC = () => {
  // Example data to display multiple Learn Cards
  const learnCardsData = [
    {
      title: "Practice Biosecurity to Save Pigs",
      department: "Food and Agriculture Organization of the United Nations",
      videoUrl: "https://www.youtube.com/embed/VIOwydNgAVY?si=kjsnQrK4jfCRkuYW", // YouTube video URL
      imageUrl: "",
      description:
        "Practical steps on how to implement biosecurity to tackle ASF in pig farms, including cleaning and disinfecting pig pens.",
    },
    {
      title: "Goat Farming",
      department: "Food and Agriculture Organization of the United Nations",
      videoUrl: "https://www.youtube.com/embed/9fM5D5cM0HU?si=2ek8c1hFOTCvlDGs", // YouTube video URL
      imageUrl: "",
      description: "All about goat farming.",
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
    marginTop: 10,
    padding: 10,
  },
  scrollContainer: {
    paddingBottom: 20, // Adds extra padding at the bottom for scrolling
  },
});

export default LearnScreen;
