import library from "../../assets/data/library.json";
import { unknownTrackImageUri } from "@/constants/images";
import { create } from "zustand";

// Tạo store với Zustand
export const useLibraryStore = create((set, get) => ({
  tracks: library.tracks || [], // Mảng tracks được lưu trữ trong store
  playlists: [], // Mảng playlists được lưu trữ trong store

  // Hàm tạo playlist mới
  createPlaylist: async (playlistName) => {
    console.log("Creating playlist:", playlistName);
    const newPlaylist = {
      id: Date.now().toString(), // Tạo ID ngẫu nhiên cho playlist mới
      name: playlistName,
      tracks: [],
      artworkPreview: unknownTrackImageUri,
    };

    const existingPlaylist = get().playlists.find(
      (playlist) => playlist.name === playlistName
    );

    if (existingPlaylist) {
      console.log("Playlist already exists:", existingPlaylist);
      throw new Error("Playlist đã tồn tại."); // Ném lỗi nếu playlist đã tồn tại
    }

    set((state) => ({
      playlists: [...state.playlists, newPlaylist],
    }));

    console.log("Newly created playlist:", newPlaylist);
    return newPlaylist; // Trả về playlist mới
  },

  // Hàm thêm track vào playlist
  addToPlaylist: (track, playlistName) => {
    set((state) => {
      const updatedPlaylists = state.playlists.map((playlist) => {
        if (playlist.name === playlistName) {
          // Kiểm tra xem track đã có trong playlist chưa
          if (!playlist.tracks.some((t) => t.url === track.url)) {
            return {
              ...playlist,
              tracks: [...playlist.tracks, track], // Thêm track vào playlist
            };
          }
        }
        return playlist; // Trả về playlist không thay đổi
      });
      return { playlists: updatedPlaylists };
    });
  },

  // Hàm xóa playlist
  removePlaylist: (playlistId) => {
    set((state) => ({
      playlists: state.playlists.filter(
        (playlist) => playlist.id !== playlistId
      ),
    }));
  },

  // Hàm đánh dấu yêu thích
  toggleTrackFavorite: (track) =>
    set((state) => ({
      tracks: state.tracks.map((currentTrack) => {
        if (currentTrack.url === track.url) {
          return {
            ...currentTrack,
            rating: currentTrack.rating === 1 ? 0 : 1, // Thay đổi trạng thái yêu thích
          };
        }
        return currentTrack; // Trả về track không thay đổi
      }),
    })),

  // Hàm đặt danh sách tracks
  setTracks: (newTracks) => set(() => ({ tracks: newTracks })),
}));

// Export hooks để sử dụng trong component
export const useTracks = () => useLibraryStore((state) => state.tracks);
export const setTracks = (newTracks) =>
  useLibraryStore((state) => state.setTracks);

export const useFavorites = () => {
  const favorites = useLibraryStore((state) =>
    state.tracks.filter((track) => track.rating === 1)
  );
  const toggleTrackFavorite = useLibraryStore(
    (state) => state.toggleTrackFavorite
  );

  return {
    favorites,
    toggleTrackFavorite,
  };
};

export const useArtists = () =>
  useLibraryStore((state) => {
    return state.tracks.reduce((acc, track) => {
      const existingArtist = acc.find((artist) => artist.name === track.artist);

      if (existingArtist) {
        existingArtist.tracks.push(track); // Thêm track vào artist hiện có
      } else {
        acc.push({
          name: track.artist ?? "Unknown",
          tracks: [track], // Tạo artist mới với track đầu tiên
        });
      }

      return acc;
    }, []);
  });

export const usePlaylists = () => {
  const playlists = useLibraryStore((state) => state.playlists);
  const addToPlaylist = useLibraryStore((state) => state.addToPlaylist);
  const createPlaylist = useLibraryStore((state) => state.createPlaylist);
  const removePlaylist = useLibraryStore((state) => state.removePlaylist);

  return { playlists, addToPlaylist, createPlaylist, removePlaylist };
};

// Store đăng nhập (không liên quan đến vấn đề chính nhưng giữ nguyên)
export const useLoginStore = create((set) => ({
  token: null,
  setToken: (newToken) => set((state) => ({ token: newToken })),
  isLoggedIn: () => useLibraryStore.getState().token !== null,
}));
