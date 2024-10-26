import { colors } from "@/constants/tokens";
import { defaultStyles } from "@/styles";
import { AntDesign } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Button,
} from "react-native";
import FastImage from "react-native-fast-image";

export const PlaylistListItem = ({ playlist, onDelete, ...props }) => {
  return (
    <TouchableHighlight activeOpacity={0.8} {...props}>
      <View style={styles.playlistItemContainer}>
        <FastImage
          source={{
            uri: playlist.artworkPreview,
            priority: FastImage.priority.normal,
          }}
          style={styles.playlistArtworkImage}
        />
        <View style={styles.playlistInfoContainer}>
          <Text numberOfLines={1} style={styles.playlistNameText}>
            {playlist.name}
          </Text>
          <AntDesign
            name="right"
            size={16}
            color={colors.icon}
            style={{ opacity: 0.5 }}
          />
        </View>
        <Button title="Xóa" onPress={onDelete} color="red" />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  playlistItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 90,
  },
  playlistArtworkImage: {
    borderRadius: 8,
    width: 70,
    height: 70,
  },
  playlistNameText: {
    ...defaultStyles.text,
    fontSize: 17,
    fontWeight: "600",
    maxWidth: "60%",
  },
  playlistInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});
