import { TracksList } from '@/components/TracksList'
import { screenPadding } from '@/constants/tokens'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'
import { useTracks } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useMemo } from 'react'
import { ScrollView, View, TextInput } from 'react-native'
import { useState } from "react";

const SongsScreen = () => {
	const [search, setSearch] = useState("");

	const tracks = useTracks();

	// Hàm lọc cho danh sách bài hát
  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      // Kiểm tra xem track.artist có phải là undefined hay không
      if (typeof track.artist === 'undefined') return false;
  
      const isTitleMatch = trackTitleFilter(search)(track);
      const isArtistMatch = track.artist.toLowerCase().includes(search.toLowerCase());
      return isTitleMatch || isArtistMatch;
    });
  }, [search, tracks]);
	return (
		<View style={defaultStyles.container}>
			<TextInput
				placeholder="Tìm Kiếm Bài Hát hoặc Ca Sĩ"
				style={{
					paddingHorizontal: screenPadding.horizontal,
					backgroundColor: "white",
					paddingVertical: 10,
					borderRadius: 10,
					margin: 10,
				}}
				value={search}
				onChangeText={setSearch}
			/>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={{ paddingHorizontal: screenPadding.horizontal }}>
				<TracksList
					id={generateTracksListId('songs', search)} // Cập nhật id để bao gồm tên tìm kiếm
					tracks={filteredTracks}
					scrollEnabled={false} />
			</ScrollView>
		</View>
	);
}

export default SongsScreen;