import library from "../../assets/data/library.json";
import { unknownTrackImageUri } from "@/constants/images";
import { create } from "zustand";

export const useLibraryStore = create()((set) => ({
  tracks: [],
  toggleTrackFavorite: (track) =>
    set((state) => ({
      tracks: state.tracks.map((currentTrack) => {
        if (currentTrack.url === track.url) {
          return {
            ...currentTrack,
            rating: currentTrack.rating === 1 ? 0 : 1,
          };
        }

        return currentTrack;
      }),
    })),
  addToPlaylist: (track, playlistName) =>
    set((state) => ({
      tracks: state.tracks.map((currentTrack) => {
        if (currentTrack.url === track.url) {
          return {
            ...currentTrack,
            playlist: [...(currentTrack.playlist ?? []), playlistName],
          };
        }

        return currentTrack;
      }),
    })),
  setTracks: (newTracks) => set((state) => ({ tracks: newTracks })),
}));

export const useTracks = () => useLibraryStore((state) => state.tracks);
export const setTracks = () => useLibraryStore((state) => state.setTracks);

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
        existingArtist.tracks.push(track);
      } else {
        acc.push({
          name: track.artist ?? "Unknown",
          tracks: [track],
        });
      }

      return acc;
    }, []);
  });

export const usePlaylists = () => {
  const playlists = useLibraryStore((state) => {
    return state.tracks.reduce((acc, track) => {
      track.playlist?.forEach((playlistName) => {
        const existingPlaylist = acc.find(
          (playlist) => playlist.name === playlistName
        );

        if (existingPlaylist) {
          existingPlaylist.tracks.push(track);
        } else {
          acc.push({
            name: playlistName,
            tracks: [track],
            artworkPreview: track.artwork ?? unknownTrackImageUri,
          });
        }
      });

      return acc;
    }, []);
  });

  const addToPlaylist = useLibraryStore((state) => state.addToPlaylist);

  return { playlists, addToPlaylist };
};


export const useLoginStore = create()((set) => ({
  token: null, 
  setToken: (newToken) => set((state) => ({ token: newToken })),
  isLoggedIn: () => state.token !== null, 
}));