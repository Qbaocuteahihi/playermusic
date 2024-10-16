// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAcxlP71P6N_L1sPRNuGAvyihZKr3Sgf4",
  authDomain: "music-player-e6223.firebaseapp.com",
  projectId: "music-player-e6223",
  storageBucket: "music-player-e6223.appspot.com",
  messagingSenderId: "603898252821",
  appId: "1:603898252821:web:4359e0802b90d9132c881c",
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

