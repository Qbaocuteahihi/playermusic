import { avatarUri, logoutIconUri } from "@/constants/images";
import { defaultStyles } from "@/styles";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { useLoginStore } from "@/store/library";
import { useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/store/firebase";
import { useState } from "react";

const ArtistsScreen = () => {
  const router = useRouter();
  const loginStore = useLoginStore();
  const [userInformation, setUserInformation] = useState({});

  const logout = () => {
    router.replace("(login)");
  };

  const getUserInfo = async () => {
    try {
      const userRef = doc(db, "Users", loginStore.token);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setUserInformation(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log("Error getting document:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <View style={defaultStyles.container}>
      <View>
        <Text>Account</Text>
      </View>
      <View style={styles.headerContainer}>
        <FastImage
          source={{
            uri: avatarUri,
            priority: FastImage.priority.normal,
          }}
          style={styles.avatar}
        />
        <Text style={styles.accountName}>{userInformation.fullname}</Text>
        <Text style={styles.accountNumber}>{userInformation.email}</Text>
      </View>
      <View style={styles.menuContainer}>
        <View style={styles.artistItemContainer}>
          <View>
            <FastImage
              source={{
                uri: logoutIconUri,
                priority: FastImage.priority.normal,
              }}
              style={styles.artistImage}
            />
          </View>

          <TouchableOpacity style={{ width: "100%" }} onPress={() => logout()}>
            <Text numberOfLines={1} style={styles.artistNameText}>
              {"Logout"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  artistItemContainer: {
    flexDirection: "row",
    columnGap: 14,
    alignItems: "center",
    marginStart: 32,
  },
  artistImage: {
    width: 25,
    height: 25,
  },
  artistNameText: {
    ...defaultStyles.text,
    fontSize: 17,
    maxWidth: "80%",
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  accountName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
    color: "white",
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
  },
  menuContainer: {
    marginTop: 16,
  },
});

export default ArtistsScreen;
