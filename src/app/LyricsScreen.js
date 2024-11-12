// // LyricsScreen.js
// import React from "react";
// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import { colors } from "@/constants/tokens";

// const LyricsScreen = ({ route }) => {
//   const lyrics = route.params?.lyrics; // Sử dụng optional chaining

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {lyrics ? (
//           <Text style={styles.lyricsText}>{lyrics}</Text>
//         ) : (
//           <Text style={styles.noLyricsText}>Lyrics not available</Text>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//     padding: 20,
//   },
//   scrollContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   lyricsText: {
//     color: "#fff",
//     fontSize: 20,
//     textAlign: "center",
//   },
//   noLyricsText: {
//     color: "#fff",
//     fontSize: 20,
//     textAlign: "center",
//     fontStyle: "italic",
//   },
// });

// export default LyricsScreen;
