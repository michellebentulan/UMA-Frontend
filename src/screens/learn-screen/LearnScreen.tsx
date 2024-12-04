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
      title:
        "Pekin Duck Farming Part 1: Pekin Duck Industry in the Philippines",
      department: "Agribusiness How It Works",
      videoUrl: "https://www.youtube.com/embed/V2R2M1eqx28?si=ETxmkuOrIuF_M1P6", // YouTube video URL
      imageUrl: "",
      description:
        "It explores the industry's current status, marketing evolution, and challenges faced by major producers, including issues related to importation.",
    },
    {
      title:
        "Pekin Duck Farming Part 2 : How to Raise Pekin Duck | Agribusiness Philippines",
      department: "Agribusiness How It Works",
      videoUrl: "https://www.youtube.com/embed/H3N5S3TaUmQ?si=_qeJLM5X90aU2HLj", // YouTube video URL
      imageUrl: "",
      description:
        "This segment discusses the prerequisites and considerations for raising Pekin ducks, offering instructional guidance for starting a Pekin duck farming business.",
    },
    {
      title:
        "Pekin Duck Breeding Part 1 : Pekin Duck Breeding in the Philippines | Agribusiness Philippines",
      department: "Agribusiness How It Works",
      videoUrl: "https://www.youtube.com/embed/zr3b3D7N9cw?si=N5-GxqBqfrogFiAw", // YouTube video URL
      imageUrl: "",
      description:
        "video examines the growing interest in Pekin duck breeding within the country, providing insights into breeding practices.",
    },

    {
      title:
        "Pekin Duck Breeding Part 2 : Pekin duck Breeding Management | Agribusiness Philippines",
      department: "Agribusiness How It Works",
      videoUrl: "https://www.youtube.com/embed/zr3b3D7N9cw?si=N5-GxqBqfrogFiAw", // YouTube video URL
      imageUrl: "",
      description:
        "video examines the growing interest in Pekin duck breeding within the country, providing insights into breeding practices.",
    },
    {
      title: "Cattle Farming in the Philippines",
      department: "Agribusiness How It Works",
      videoUrl: "https://www.youtube.com/embed/0TGTuWy1w4g?si=C_xcUEPgyJsH7v9e", // YouTube video URL
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
