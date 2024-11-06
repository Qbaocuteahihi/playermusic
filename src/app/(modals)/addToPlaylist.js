import { screenPadding } from "@/constants/tokens";
import { usePlaylists, useTracks } from "@/store/library";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  TextInput,
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
  const { createPlaylist, addToPlaylist, playlists } = usePlaylists();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showInput, setShowInput] = useState(false); // State to show/hide input

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

      // Chuyển đến trang playlist ngay sau khi thêm thành công
      router.push("/playlists"); // Đường dẫn đến trang playlist

      setNewPlaylistName("");
      setShowInput(false); // Ẩn ô nhập liệu sau khi tạo playlist
    } catch (error) {
      Alert.alert("Đã xảy ra lỗi:", error.message);
      console.error("Error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddToPlaylist = async (playlist) => {
    try {
      await addToPlaylist(track, playlist.name);

      // Chuyển đến trang playlist ngay sau khi thêm thành công
      router.push("/playlists"); // Đường dẫn đến trang playlist
    } catch (error) {
      Alert.alert("Đã xảy ra lỗi:", error.message);
      console.error("Error:", error);
    }
  };

  const renderPlaylists = () => {
    return (
      <View style={styles.playlistsContainer}>
        {playlists.length === 0 ? (
          <Text style={styles.noPlaylistsText}>Chưa có playlist nào.</Text>
        ) : (
          <>
            <Text style={styles.playlistTitle}>Danh sách Playlist:</Text>
            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.playlistItem}
                  onPress={() => handleAddToPlaylist(item)}
                >
                  <Text style={styles.playlistName}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={styles.playlistList}
            />
          </>
        )}
        {showInput ? (
          <>
            <TextInput
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              placeholder="Nhập tên playlist"
              placeholderTextColor="#999"
              style={styles.input}
            />
            <TouchableOpacity
              onPress={handleCreatePlaylist}
              style={styles.createButton}
            >
              <Text style={styles.buttonText}>Tạo Playlist</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={() => setShowInput(true)} // Show input when button is pressed
            style={styles.createButton}
          >
            <Text style={styles.buttonText}>Tạo Playlist Mới</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.modalContainer, { paddingTop: headerHeight }]}>
      <View>
        {isCreating ? (
          <ActivityIndicator size="large" color="#BB86FC" />
        ) : (
          renderPlaylists()
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingHorizontal: screenPadding.horizontal,
    justifyContent: "center",
    backgroundColor: "#121212",
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    color: "white",
  },
  playlistsContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  playlistList: {
    marginTop: 10,
    width: "100%", // Ensure it takes full width
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: "100%", // Ensure it takes full width
  },
  playlistName: {
    fontSize: 16,
    color: "white",
  },
  createButton: {
    backgroundColor: "#BB86FC",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  noPlaylistsText: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  playlistTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default AddToPlaylistModal;
