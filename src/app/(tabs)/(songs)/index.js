import { TracksList } from '@/components/TracksList'
import { screenPadding } from '@/constants/tokens'
import { trackTitleFilter } from '@/helpers/filter'
import { generateTracksListId } from '@/helpers/miscellaneous'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useTracks } from '@/store/library'
import { defaultStyles } from '@/styles'
import { useMemo } from 'react'
import { ScrollView, View, TextInput } from 'react-native'
import { useState } from "react";

const SongsScreen = () => {
	// const search = useNavigationSearch({
	// 	searchBarOptions: {
	// 		placeholder: 'Find in songs',
	// 	},
	// })

	const [search, setSearch] = useState("");

	const tracks = useTracks()

	const filteredTracks = useMemo(() => {
		if (!search) return tracks

		return tracks.filter(trackTitleFilter(search));
	}, [search, tracks])



	return (
        <View style={defaultStyles.container}>
	<TextInput
        placeholder="Find in songs"
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
                    id={generateTracksListId('songs', search)}
                    tracks={filteredTracks}
                    scrollEnabled={false} />
			</ScrollView>
		</View>
    );
}

export default SongsScreen
