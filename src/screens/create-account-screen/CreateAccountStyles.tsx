import { StyleSheet, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: "5%",
    justifyContent: "center", // Center content vertically
    flexGrow: 1,
  },
  backButton: {
    paddingTop: 20,
    marginTop: 20,
  },
  middleSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%",
  },
  lottie: {
    width: "75%",
    aspectRatio: 1,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  title: {
    fontSize: RFValue(20),
    fontFamily: "Montserrat_400Regular",
    marginBottom: RFValue(20),
    textAlign: "center",
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#888",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFValue(20),
    margin: "1%",
  },
  input: {
    flex: 1,
    fontSize: RFValue(13),
    paddingVertical: RFValue(9),
    fontFamily: "Montserrat_400Regular",
  },
  eyeIcon: {
    paddingHorizontal: RFValue(10),
  },
  createAccountButton: {
    width: "75%",
    paddingVertical: "3.8%",
    backgroundColor: "#A14B44",
    borderRadius: 20,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 40,
  },
  createAccountButtonText: {
    color: "#FFFFFF",
    fontSize: RFValue(15),
    fontFamily: "Montserrat_400Regular",
  },
  termsText: {
    fontSize: RFValue(13),
    color: "#333",
    marginVertical: RFValue(10),
    textAlign: "center",
    lineHeight: 28,
  },
  link: {
    color: "#A0522D",
    textDecorationLine: "underline",
    fontSize: RFValue(13),
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: RFValue(2),
  },
  checkbox: {
    marginRight: 8,
    marginBottom: 25,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default styles;
