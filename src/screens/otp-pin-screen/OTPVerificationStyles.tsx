import { StyleSheet, Platform, KeyboardAvoidingView } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  backButton: {
    marginTop: 20,
    alignSelf: "flex-start",
  },
  imageContainer: {
    marginVertical: 30,
  },
  lottie: {
    width: "75%",
    aspectRatio: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginVertical: 10,
  },
  phoneText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  phoneNumber: {
    fontWeight: "bold",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    width: 40,
    height: 50,
    textAlign: "center",
    fontSize: 20,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    padding: 15,
    margin: 5,
  },
  resendText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginVertical: 10,
  },
  resendLink: {
    color: "#A0522D",
    textDecorationLine: "underline",
  },
  verifyButton: {
    backgroundColor: "#A14B44",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginTop: 20,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Montserrat_400Regular",
  },
});

export default styles;
