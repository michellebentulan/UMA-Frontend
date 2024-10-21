import { StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: "5%",
    justifyContent: "center", // Center content vertically
  },

  backButton: {
    paddingTop: 20,
    marginTop: 20,
  },
  middleSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%", // Reduced marginTop for better fit
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
    marginBottom: RFValue(20), // Use RFValue for consistency
    textAlign: "center",
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#888",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFValue(20), // Use RFValue for consistency
    margin: "1%",
  },
  input: {
    flex: 1,
    fontSize: RFValue(12),
    paddingVertical: RFValue(9),
    fontFamily: "Montserrat_400Regular",
  },
  eyeIcon: {
    paddingHorizontal: RFValue(10),
  },
  loginButton: {
    width: "75%",
    paddingVertical: "3.8%",
    backgroundColor: "#A14B44",
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: RFValue(15),
    fontFamily: "Montserrat_400Regular",
  },

  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: RFValue(10),
    width: "95%",
  },

  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#888",
  },

  separatorText: {
    fontSize: RFValue(14),
    fontFamily: "Montserrat_400Regular",
    color: "#888",
    textAlign: "center",
    paddingHorizontal: RFValue(10),
  },

  createAccountButton: {
    width: "75%",
    paddingVertical: "3.8%",
    borderWidth: 1,
    borderColor: "#A14B44",
    borderRadius: RFValue(20),
    alignItems: "center",
    marginBottom: "4%",
  },
  createAccountButtonText: {
    color: "#232323",
    fontSize: RFValue(15),
    fontFamily: "Montserrat_400Regular", // Using Montserrat Bold
  },
});

export default styles;
