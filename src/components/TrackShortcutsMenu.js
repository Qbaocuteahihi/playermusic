import { useFavorites } from '@/store/library'
import { useQueue } from '@/store/queue'
import { MenuView } from '@react-native-menu/menu'
import { useRouter } from 'expo-router'
import TrackPlayer from 'react-native-track-player';
// import { match } from 'ts-pattern'

export const TrackShortcutsMenu = ({
    track,
    children
}) => {
	const router = useRouter()

	const isFavorite = track.rating === 1

	const { toggleTrackFavorite } = useFavorites()
	const { activeQueueId } = useQueue()

	const handlePressAction = async (id) => {
		if (id === 'add-to-favorites') {
			toggleTrackFavorite(track);
	
			// if the track is in the favorite queue, add it
			if (activeQueueId?.startsWith('favorites')) {
				await TrackPlayer.add(track);
			}
		} else if (id === 'remove-from-favorites') {
			toggleTrackFavorite(track);
	
			// if the track is in the favorites queue, we need to remove it
			if (activeQueueId?.startsWith('favorites')) {
				const queue = await TrackPlayer.getQueue();
	
				const trackToRemove = queue.findIndex((queueTrack) => queueTrack.url === track.url);
	
				await TrackPlayer.remove(trackToRemove);
			}
		} else if (id === 'add-to-playlist') {
			// it opens the addToPlaylist modal
			// @ts-expect-error it should work
			router.push({ pathname: '(modals)/addToPlaylist', params: { trackUrl: track.url } });
		} else {
			console.warn(`Unknown menu action ${id}`);
		}
	};
	

	return (
        <MenuView
            onPressAction={({ nativeEvent: { event } }) => handlePressAction(event)}
            actions={[
				{
					id: isFavorite ? 'remove-from-favorites' : 'add-to-favorites',
					title: isFavorite ? 'Remove from favorites' : 'Add to favorites',
					image: isFavorite ? 'star.fill' : 'star',
				},
				{
					id: 'add-to-playlist',
					title: 'Add to playlist',
					image: 'plus',
				},
			]}>
			{children}
		</MenuView>
    );
}
