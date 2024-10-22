// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCk0gFO7FVXeUH2lyVDeyc5jnTjalNmVbQ",
  authDomain: "musicappgroup3-ffe2a.firebaseapp.com",
  projectId: "musicappgroup3-ffe2a",
  storageBucket: "musicappgroup3-ffe2a.appspot.com",
  messagingSenderId: "606228771903",
  appId: "1:606228771903:web:c7e8c1d2da8c80e1fa348a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
// export const uploadTracks = async () => {
//   library.forEach(async (track) => {
//     await addDoc(collection(db, "tracks"), track);
//   });
// };

