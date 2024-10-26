import { screenPadding } from "@/constants/tokens";
import { usePlaylists, useTracks } from "@/store/library";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";

const AddToPlaylistModal = () => {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const route = useRoute();
  const { trackUrl } = route.params;

  const tracks = useTracks();
  const { createPlaylist, addToPlaylist, removePlaylist, playlists } =
    usePlaylists();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const track = tracks.find((currentTrack) => trackUrl === currentTrack.url);

  if (!track) {
    Alert.alert("Lỗi", "Không tìm thấy bài hát.");
    return null;
  }

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim() === "") {
      Alert.alert("Tên playlist không được để trống.");
      return;
    }

    const exists = playlists.some(
      (playlist) => playlist.name === newPlaylistName
    );
    if (exists) {
      Alert.alert("Playlist đã tồn tại. Vui lòng chọn tên khác.");
      return;
    }

    setIsCreating(true);
    try {
      const newPlaylist = await createPlaylist(newPlaylistName);
      await addToPlaylist(track, newPlaylist.name);

      Alert.alert("Bài hát đã được thêm vào playlist thành công!");
      setNewPlaylistName("");
      router.dismiss();
    } catch (error) {
      Alert.alert("Đã xảy ra lỗi:", error.message);
      console.error("Error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePlaylist = (playlist) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa playlist "${playlist.name}" không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await removePlaylist(playlist.id);
              Alert.alert("Playlist đã được xóa thành công!");
            } catch (error) {
              Alert.alert("Đã xảy ra lỗi:", error.message);
              console.error("Error:", error);
            } finally {
              setIsDeleting(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.modalContainer, { paddingTop: headerHeight }]}>
      <View>
        <TextInput
          value={newPlaylistName}
          onChangeText={setNewPlaylistName}
          placeholder="Nhập tên playlist"
          placeholderTextColor="#999"
          style={styles.input}
        />
        {isCreating || isDeleting ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button title="Tạo Playlist" onPress={handleCreatePlaylist} />
            <Button title="Hủy" onPress={() => router.dismiss()} />
            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.playlistItem}
                  onPress={() => handleDeletePlaylist(item)}
                >
                  <Text style={styles.playlistName}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={styles.playlistList}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingHorizontal: screenPadding.horizontal,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  playlistList: {
    marginTop: 20,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  playlistName: {
    fontSize: 16,
    color: "#333",
  },
});

export default AddToPlaylistModal;
