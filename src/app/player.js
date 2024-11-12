import { MovingText } from "@/components/MovingText";
import { PlayerControls } from "@/components/PlayerControls";
import { PlayerProgressBar } from "@/components/PlayerProgressbar";
import { PlayerRepeatToggle } from "@/components/PlayerRepeatToggle";
import { PlayerVolumeBar } from "@/components/PlayerVolumeBar";
import { TrackRating } from "./TrackRating";
import { unknownTrackImageUri } from "@/constants/images";
import { colors, fontSize, screenPadding } from "@/constants/tokens";
import { useTrackPlayerFavorite } from "@/hooks/useTrackPlayerFavorite";
import { defaultStyles, utilsStyles } from "@/styles";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActiveTrack } from "react-native-track-player";
import { useState, useEffect, useRef } from "react";

const DismissPlayerSymbol = ({ top }) => {
  return (
    <View
      style={{
        position: "absolute",
        top: top + 8,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <View accessible={false} style={styles.dismissSymbol} />
    </View>
  );
};

const PlayerScreen = () => {
  const activeTrack = useActiveTrack();
  const { top, bottom } = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useTrackPlayerFavorite();
  const [trackRating, setTrackRating] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 30; // Respond to horizontal swipes
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100) {
          // Swipe right to show lyrics
          setShowLyrics(true);
          setShowContent(false);
        } else if (gestureState.dx < -100) {
          // Swipe left to hide lyrics and show content
          setShowLyrics(false);
          setShowContent(true);
        }
      },
    })
  ).current;

  useEffect(() => {
    const getTrackRating = async () => {
      try {
        const rating = await AsyncStorage.getItem(
          `track-${activeTrack.id}-rating`
        );
        setTrackRating(rating ? parseInt(rating) : 0);
      } catch (error) {
        console.error("Error getting track rating:", error);
      }
    };
    if (activeTrack) {
      getTrackRating();
    }
  }, [activeTrack]);

  const handleRatingChange = async (newRating) => {
    setTrackRating(newRating);
    try {
      await AsyncStorage.setItem(
        `track-${activeTrack.id}-rating`,
        newRating.toString()
      );
    } catch (error) {
      console.error("Error saving track rating:", error);
    }
  };

  if (!activeTrack) {
    return (
      <View style={[defaultStyles.container, { justifyContent: "center" }]}>
        <ActivityIndicator color={colors.icon} />
      </View>
    );
  }

  const imageColors = ["#000", "#333"];
  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={
        imageColors ? [imageColors[0], imageColors[1]] : [colors.background]
      }
    >
      <View style={styles.overlayContainer} {...panResponder.panHandlers}>
        <DismissPlayerSymbol top={top} />

        <View
          style={[
            styles.contentContainer,
            { marginTop: top + 70, marginBottom: bottom },
          ]}
        >
          <View style={styles.artworkImageContainer}>
            <FastImage
              source={{
                uri: activeTrack.artwork ?? unknownTrackImageUri,
                priority: FastImage.priority.high,
              }}
              resizeMode="cover"
              style={styles.artworkImage}
            />
          </View>

          {showContent && (
            <View style={{ flex: 1, marginTop: 20 }}>
              <View style={styles.trackInfoContainer}>
                <View style={styles.trackTitleContainer}>
                  <MovingText
                    text={activeTrack.title ?? ""}
                    animationThreshold={30}
                    style={styles.trackTitleText}
                  />
                </View>

                <FontAwesome
                  name={isFavorite ? "heart" : "heart-o"}
                  size={20}
                  color={isFavorite ? colors.primary : colors.icon}
                  style={styles.favoriteIcon}
                  onPress={toggleFavorite}
                />
              </View>

              <View style={styles.trackMetaContainer}>
                <Text numberOfLines={1} style={styles.trackMetaText}>
                  {activeTrack.artist
                    ? `Trình bày: ${activeTrack.artist}`
                    : "Trình bày: Chưa cập nhật"}
                </Text>

                <Text
                  numberOfLines={1}
                  style={[styles.trackMetaText, { marginTop: 4 }]}
                >
                  {activeTrack.author
                    ? `Tác giả: ${activeTrack.author}`
                    : "Tác giả: Chưa cập nhật"}
                </Text>

                {activeTrack.playlist && activeTrack.playlist.length > 0 && (
                  <Text
                    numberOfLines={1}
                    style={[styles.trackMetaText, { marginTop: 4 }]}
                  >
                    Thể loại: {activeTrack.playlist.join(", ")}
                  </Text>
                )}

                <TrackRating
                  initialRating={trackRating}
                  onRatingChange={handleRatingChange}
                />
              </View>

              <View style={{ marginTop: 20 }}>
                <PlayerProgressBar />
                <PlayerControls style={{ marginTop: 20 }} />
              </View>
            </View>
          )}

          {showLyrics && activeTrack.lyrics && (
            <ScrollView style={styles.lyricsContainer}>
              <Text style={styles.lyricsText}>{activeTrack.lyrics}</Text>
            </ScrollView>
          )}
        </View>

        {!showLyrics && ( // Hide controls when showing lyrics
          <View style={[styles.controlsContainer, { marginBottom: bottom }]}>
            <PlayerVolumeBar />
            <View style={utilsStyles.centeredRow}>
              <PlayerRepeatToggle size={30} />
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...defaultStyles.container,
    paddingHorizontal: screenPadding.horizontal,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  contentContainer: {
    flex: 1,
  },
  artworkImageContainer: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 11.0,
    flexDirection: "row",
    justifyContent: "center",
    height: "45%",
  },
  artworkImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 12,
  },
  trackInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trackTitleContainer: {
    flex: 1,
    overflow: "hidden",
  },
  trackTitleText: {
    ...defaultStyles.text,
    fontSize: 22,
    fontWeight: "700",
  },
  trackMetaContainer: {
    marginTop: 12,
  },
  trackMetaText: {
    ...defaultStyles.text,
    fontSize: fontSize.base,
    opacity: 0.8,
    maxWidth: "90%",
  },
  favoriteIcon: {
    marginHorizontal: 14,
  },
  controlsContainer: {
    paddingHorizontal: screenPadding.horizontal,
    marginTop: "auto",
  },
  dismissSymbol: {
    width: 50,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    opacity: 0.7,
  },
  lyricsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  lyricsText: {
    ...defaultStyles.text,
    fontSize: 16,
    color: "#fff",
    lineHeight: 24,
    textAlign: "center",
  },
});

export default PlayerScreen;
