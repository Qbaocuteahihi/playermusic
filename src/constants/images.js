import unknownArtistImage from '../../assets/unknown_artist.png'
import unknownTrackImage from '../../assets/unknown_track.png'
import avatar from '../../assets/avatar.png'
import logoutIcon from '../../assets/logoutIcon.png'
import { Image } from 'react-native'

export const unknownTrackImageUri = Image.resolveAssetSource(unknownTrackImage).uri
export const unknownArtistImageUri = Image.resolveAssetSource(unknownArtistImage).uri
export const avatarUri = Image.resolveAssetSource(avatar).uri
export const logoutIconUri = Image.resolveAssetSource(logoutIcon).uri
