import { useEffect, useState } from 'react'
import { useActiveTrack } from 'react-native-track-player';

export const useLastActiveTrack = () => {
	const activeTrack = useActiveTrack()
	const [lastActiveTrack, setLastActiveTrack] = useState()

	useEffect(() => {
		if (!activeTrack) return

		setLastActiveTrack(activeTrack)
	}, [activeTrack])

	return lastActiveTrack
}
