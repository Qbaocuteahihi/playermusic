import { colors } from "@/constants/tokens";
import { auth } from "@/store/firebase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLoginStore } from "@/store/library";
import { signInWithEmailAndPassword } from "firebase/auth";
const LoginScreen = () => {
  const [gmailString, setgmailString] = useState("");
  const [passwordString, setPasswordString] = useState("");
  const router = useRouter();
  const loginStore = useLoginStore();

  const onNext = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        gmailString,
        passwordString
      );

      if (userCredential) {
        router.push("(tabs)");
        loginStore.setToken(userCredential.user.uid);
      }
    } catch (error) {
      console.log("Error signing in", error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Welcome to MusicApp</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Gmail</Text>
          <TextInput
            style={styles.inputStyle}
            placeholder="Enter your email"
            value={gmailString}
            onChangeText={(text) => setgmailString(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            value={passwordString}
            onChangeText={(text) => setPasswordString(text)}
            secureTextEntry={true}
          />
        </View>
      </View>

      <TouchableOpacity onPress={() => onNext()} style={styles.buttonContainer}>
        <Text style={{ color: "white" }}>Đăng Nhập</Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text style={styles.unregisterText}>
          Bạn chưa có tài khoản?  {" "}
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.push(`register`);
          }}
        >
          <Text style={styles.primaryText}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

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
  forgotText: {
    fontWeight: "600",
    color: "#FB344F",
    textAlign: "right",
  },
  title: {
    fontSize: 24,
    marginBottom: 60,
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
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  registerContainer: {
    marginTop: 20,
    alignSelf: "center",
    flexDirection: "row",
  },
  unregisterText: {
    color: "#999EA1",
  },
  primaryText: {
    color: colors.primary,
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
