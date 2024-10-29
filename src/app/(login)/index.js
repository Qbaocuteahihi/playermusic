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
  Image,
} from "react-native";
import { useLoginStore } from "@/store/library";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = () => {
  const [gmailString, setgmailString] = useState("");
  const [passwordString, setPasswordString] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State để lưu trữ thông báo lỗi
  const router = useRouter();
  const loginStore = useLoginStore();

  const onNext = async () => {
    if (!gmailString || !passwordString) {
      setErrorMessage("Vui lòng nhập Email và Password");
      return;
    }

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
      setErrorMessage("Sai Email hoặc Password. Vui lòng thử lại");
      console.log("Error signing in", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo lớn */}
      <Image
        source={require("../../../assets/logoapp.png")} // Thay đường dẫn logo của bạn ở đây
        style={styles.logo}
      />

      <View style={styles.inputWrapper}>
        {/* Email Input */}
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={gmailString}
          onChangeText={(text) => setgmailString(text)}
          placeholderTextColor="#999"
        />

        {/* Password Input */}
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={passwordString}
          onChangeText={(text) => setPasswordString(text)}
          secureTextEntry={true}
          placeholderTextColor="#999"
        />
      </View>

      {/* Hiển thị thông báo lỗi */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {/* Login Button */}
      <TouchableOpacity onPress={() => onNext()} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>

      {/* Đăng ký */}
      <View style={styles.registerContainer}>
        <Text style={styles.unregisterText}>Bạn chưa có tài khoản? </Text>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    paddingHorizontal: 30,
  },
  logo: {
    width: 280, // Điều chỉnh kích thước logo lớn
    height: 280,
    marginBottom: 10, // Khoảng cách giữa logo và input
  },
  inputWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  inputStyle: {
    width: 300,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    backgroundColor: "#f3f3f3", // Nền màu nhạt hơn cho input
    fontSize: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5, // Đổ bóng nhẹ
  },
  buttonContainer: {
    width: 300,
    backgroundColor: "#FF4B4B", // Màu đỏ của nút bấm
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  registerContainer: {
    position: "absolute",
    bottom: 10, // Căn chỉnh phần đăng ký xuống giữa
    flexDirection: "row",
  },
  unregisterText: {
    color: "#999EA1",
  },
  primaryText: {
    color: "#FF4B4B", // Màu đỏ cho chữ đăng ký
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
