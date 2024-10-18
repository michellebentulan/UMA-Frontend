import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: "5%",
    justifyContent: "space-between",
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "50%",
    height: undefined,
    aspectRatio: 1,
  },
  middleSection: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  lottie: {
    width: "70%",
    aspectRatio: 1,
  },
  introText: {
    marginTop: "5%",
    fontSize: RFValue(25),
    textAlign: "center",
    color: "#333333",
    fontFamily: "Montserrat_400Regular", // Using Montserrat Regular
  },
  introText2: {
    marginTop: "2%",
    fontSize: RFValue(12),
    textAlign: "center",
    color: "#333333",
    fontFamily: "Montserrat_400Regular", // Using Montserrat Regular
  },
  bottomSection: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    width: "75%",
    paddingVertical: "3.8%",
    backgroundColor: "#A14B44",
    borderRadius: 20,
    alignItems: "center",
    marginBottom: "4%",
  },
  createAccountButton: {
    width: "75%",
    paddingVertical: "3.8%",
    borderWidth: 1,
    borderColor: "#A14B44",
    borderRadius: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: RFValue(16),
    fontFamily: "Montserrat_400Regular", // Using Montserrat Bold
  },
  createAccountButtonText: {
    color: "#232323",
    fontSize: RFValue(16),
    fontFamily: "Montserrat_400Regular", // Using Montserrat Bold
  },
});

export default styles;
