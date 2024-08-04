import Slider from '@react-native-community/slider';
import { View } from 'react-native';
import { ProgressBar, Text, useTheme } from 'react-native-paper';
import { secToMinString } from '../utils/text';

type PlayerTrackSliderProps = {
	duration: number;
	position: number;
	buffered: number;
	onSeek: (val: number) => void;
};
export const PlayerTrackSlider = ({
	duration,
	buffered,
	onSeek,
	position,
}: PlayerTrackSliderProps) => {
	const { colors } = useTheme();
	return (
		<View style={{ paddingHorizontal: 20 }}>
			<View>
				<Slider
					style={{ width: '100%', height: 30 }}
					minimumValue={0}
					maximumValue={duration}
					value={position}
					onValueChange={onSeek}
					thumbTintColor={colors.primary}
					minimumTrackTintColor="#FFFFFF"
					maximumTrackTintColor={colors.surfaceVariant}
				/>
			</View>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<Text>{secToMinString(position)}</Text>
				<Text>{secToMinString(duration)}</Text>
			</View>
		</View>
	);
};
