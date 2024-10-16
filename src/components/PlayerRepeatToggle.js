import { colors } from "@/constants/tokens";
import { useTrackPlayerRepeatMode } from "@/hooks/useTrackPlayerRepeatMode";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RepeatMode } from "react-native-track-player";
// import { match } from 'ts-pattern'

const repeatOrder = [RepeatMode.Off, RepeatMode.Track, RepeatMode.Queue];

export const PlayerRepeatToggle = ({ ...iconProps }) => {
  const { repeatMode, changeRepeatMode } = useTrackPlayerRepeatMode();

  const toggleRepeatMode = () => {
    if (repeatMode == null) return;

    const currentIndex = repeatOrder.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % repeatOrder.length;

    changeRepeatMode(repeatOrder[nextIndex]);
  };

  // const icon = match(repeatMode)
  // 	.returnType()
  // 	.with(RepeatMode.Off, () => 'repeat-off')
  // 	.with(RepeatMode.Track, () => 'repeat-once')
  // 	.with(RepeatMode.Queue, () => 'repeat')
  // 	.otherwise(() => 'repeat-off')

  function getIcon(repeatMode) {
    switch (repeatMode) {
      case RepeatMode.Off:
        return "repeat-off";
      case RepeatMode.Track:
        return "repeat-once";
      case RepeatMode.Queue:
        return "repeat";
      default:
        return "repeat-off";
    }
  }

  return (
    <MaterialCommunityIcons
      name={getIcon(repeatMode)}
      onPress={toggleRepeatMode}
      color={colors.icon}
      {...iconProps}
    />
  );
};
