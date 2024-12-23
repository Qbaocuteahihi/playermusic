import { View } from 'react-native'

export const StopPropagation = ({
    children
}) => {
	return (
        <View
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}>
			{children}
		</View>
    );
}
