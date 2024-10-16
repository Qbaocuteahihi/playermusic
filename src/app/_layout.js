import { playbackService } from "@/constants/playbackService";
import { colors } from "@/constants/tokens";
import { useLogTrackPlayerState } from "@/hooks/useLogTrackPlayerState";
import { useSetupTrackPlayer } from "@/hooks/useSetupTrackPlayer";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/store/firebase";
import { useLibraryStore } from "@/store/library";
SplashScreen.preventAutoHideAsync();

TrackPlayer.registerPlaybackService(() => playbackService);

const queryTracks = async () => {
  const tracksCollection = collection(db, "tracks");
  const tracksSnapshot = await getDocs(tracksCollection);
  return tracksSnapshot.docs.map((doc) => doc.data());
};

const App = () => {
  const store = useLibraryStore();
  const handleTrackPlayerLoaded = useCallback(() => {
    getAllTracks();
    SplashScreen.hideAsync();
  }, []);

  useSetupTrackPlayer({
    onLoad: handleTrackPlayerLoaded,
  });

  useLogTrackPlayerState();

  const getAllTracks = async () => {
    const tracks = await queryTracks();
    store.setTracks(tracks);
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootNavigation />
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

const RootNavigation = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
     <Stack.Screen name="(login)" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="player"
        options={{
          presentation: "card",
          gestureEnabled: true,
          gestureDirection: "vertical",
          animationDuration: 400,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(modals)/addToPlaylist"
        options={{
          presentation: "modal",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitle: "Add to playlist",
          headerTitleStyle: {
            color: colors.text,
          },
        }}
      />
    </Stack>
  );
};


export default App;
