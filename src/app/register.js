import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
} from "react-native";
import { colors } from "@/constants/tokens";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@/store/firebase";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "@/store/firebase";
import { useRouter } from "expo-router";
const RegisterScreen = () => {
  const router = useRouter();
  const [emailString, setEmailString] = useState("");
  const [fullnameString, setFullnameString] = useState("");
  const [passwordString, setPasswordString] = useState("");
  const [confirmPasswordString, setConfirmPasswordString] = useState("");
  const registerAccount = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailString,
        passwordString
      );
      const userInfo = {
        email: emailString,
        fullname: fullnameString,
        password: passwordString,
        token: userCredential.user.uid,
      };

      const userRef = doc(db, "Users", userCredential.user.uid);
      await setDoc(userRef, userInfo);
      router.push("(login)");
    } catch (error) {
      console.log("Error signing up: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Đăng ký</Text>
        <Text style={styles.unregisterText}>
          Please fill in the information below to register
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.phoneInput}>
            <TextInput
              style={styles.phoneInputStyle}
              placeholder="Enter your email"
              value={emailString}
              onChangeText={(text) => setEmailString(text)}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full name</Text>
          <View style={styles.phoneInput}>
            <TextInput
              style={styles.phoneInputStyle}
              placeholder="Enter your full name"
              value={fullnameString}
              onChangeText={(text) => setFullnameString(text)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.phoneInput}>
            <TextInput
              style={styles.phoneInputStyle}
              placeholder="Enter your password"
              value={passwordString}
              onChangeText={(text) => setPasswordString(text)}
              secureTextEntry={true}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.phoneInput}>
            <TextInput
              style={styles.phoneInputStyle}
              placeholder="Enter your password again"
              value={confirmPasswordString}
              onChangeText={(text) => setConfirmPasswordString(text)}
              secureTextEntry={true}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => registerAccount()}
        style={styles.buttonContainer}
      >
        <Text style={{ color: "white" }}>Đăng ký</Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text style={styles.unregisterText}>Đã có tài khoản </Text>
        <TouchableOpacity
          onPress={() => {
            router.replace("(login)");
          }}
        >
          <Text style={styles.primaryText}>Đăng nhập ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    width: "100%",
    backgroundColor: "white",
    flex: 1,
    paddingTop: 60,
  },
  rowView: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    width: "100%",
    marginBottom: 20,
  },
  inputStyle: {
    marginTop: 8,
  },
  phoneInputStyle: {
    paddingLeft: 8,
    paddingTop: 14,
    paddingRight: 8,
    paddingBottom: 14,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  forgotText: {
    fontWeight: "600",
    color: "#FB344F",
    textAlign: "right",
  },
  title: {
    fontSize: 24,
  },
  inputLabel: {
    color: colors.primary,
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    height: 40,
  },
  inputContainer: {
    marginBottom: 10,
    paddingTop: 18,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    right: 15,
  },
  registerContainer: {
    marginTop: 20,
    alignSelf: "center",
    flexDirection: "row",
  },
  unregisterText: {
    color: "#999EA1",
    marginBottom: 40,
  },
  primaryText: {
    color: colors.primary,
  },
  phoneInput: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    borderColor: "#C6C6C6",
    borderWidth: 1,
    borderRadius: 8,
    paddingStart: 12,
    marginTop: 8,
  },
  phonePrefix: {
    borderRightWidth: 1,
    borderColor: "#C6C6C6",
    paddingRight: 8,
  },
  buttonContainer: {
    backgroundColor: colors.primary,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
});
