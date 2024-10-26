import { PlaylistListItem } from "@/components/PlaylistListItem";
import { unknownTrackImageUri } from "@/constants/images";
import { playlistNameFilter } from "@/helpers/filter";
import { useNavigationSearch } from "@/hooks/useNavigationSearch";
import { utilsStyles } from "@/styles";
import { useMemo } from "react";
import { FlatList, Text, View, Alert } from "react-native";
import FastImage from "react-native-fast-image";
import { usePlaylists } from "@/store/library";

const ItemDivider = () => (
  <View
    style={{ ...utilsStyles.itemSeparator, marginLeft: 80, marginVertical: 12 }}
  />
);

export const PlaylistsList = ({ onPlaylistPress, ...flatListProps }) => {
  const { playlists, removePlaylist } = usePlaylists();
  const search = useNavigationSearch({
    searchBarOptions: {
      placeholder: "Find in playlist",
    },
  });

  const filteredPlaylists = useMemo(() => {
    return playlists.filter(playlistNameFilter(search));
  }, [playlists, search]);

  const handleDeletePlaylist = (playlist) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa playlist "${playlist.name}" không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: () => removePlaylist(playlist.id), // Gọi hàm xóa
          style: "destructive",
        },
      ]
    );
  };

  return (
    <FlatList
      contentContainerStyle={{ paddingTop: 10, paddingBottom: 128 }}
      ItemSeparatorComponent={ItemDivider}
      ListFooterComponent={ItemDivider}
      ListEmptyComponent={
        <View>
          <Text style={utilsStyles.emptyContentText}>No playlist found</Text>
          <FastImage
            source={{
              uri: unknownTrackImageUri,
              priority: FastImage.priority.normal,
            }}
            style={utilsStyles.emptyContentImage}
          />
        </View>
      }
      data={filteredPlaylists}
      renderItem={({ item: playlist }) => (
        <PlaylistListItem
          playlist={playlist}
          onPress={() => onPlaylistPress(playlist)}
          onDelete={() => handleDeletePlaylist(playlist)}
        />
      )}
      {...flatListProps}
    />
  );
};
