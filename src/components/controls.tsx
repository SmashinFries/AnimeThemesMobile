import { View } from 'react-native';
import { ActivityIndicator, IconButton } from 'react-native-paper';
import { RepeatMode } from 'react-native-track-player';

type TrackControllerProps = {
	repeatModeStatus: RepeatMode | undefined;
	hasPrevious: boolean;
	bufferingDuringPlay: boolean | undefined;
	playing: boolean | undefined;
	onPrevTrack: () => void;
	togglePlay: () => void;
	onNextTrack: () => void;
	toggleRepeatMode: () => void;
};
export const TrackController = ({
	repeatModeStatus,
	hasPrevious,
	bufferingDuringPlay,
	playing,
	togglePlay,
	onNextTrack,
	onPrevTrack,
	toggleRepeatMode,
}: TrackControllerProps) => {
	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<IconButton size={32} icon="shuffle" />
			<IconButton
				size={32}
				icon="skip-previous"
				onPress={onPrevTrack}
				disabled={hasPrevious}
			/>
			{!bufferingDuringPlay ? (
				<IconButton
					size={62}
					icon={playing ? 'pause-circle' : 'play-circle'}
					onPress={togglePlay}
				/>
			) : (
				<ActivityIndicator size={'large'} style={{ height: 62, width: 62 }} />
			)}
			<IconButton size={32} icon="skip-next" onPress={onNextTrack} />
			<IconButton
				size={32}
				selected={repeatModeStatus === RepeatMode.Track ? true : false}
				icon="repeat-variant"
				onPress={toggleRepeatMode}
			/>
		</View>
	);
};
