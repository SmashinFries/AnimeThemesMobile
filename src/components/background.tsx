import { useVideoPlayer, VideoSource, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { DimensionValue, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';
import { Image } from 'expo-image';
import { Event, State, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { View } from 'react-native';

const VIDEO_SIZE = 350;

const events = [Event.PlaybackState];

export const VideoBackground = ({
	source,
	fullscreen,
	syncWithAudio = false,
}: {
	source: VideoSource;
	fullscreen?: boolean;
	syncWithAudio?: boolean;
}) => {
	const ref = useRef(null);
	// const [isPlaying, setIsPlaying] = useState(true);
	const player = useVideoPlayer(source, (player) => {
		player.loop = true;
		player.muted = true;
		player.showNowPlayingNotification = false;
		player.staysActiveInBackground = false;
		player.play();
	});
	const { position } = useProgress();

	const { colors, dark } = useTheme();
	const { height } = useWindowDimensions();
	const { top, bottom } = useSafeAreaInsets();

	useTrackPlayerEvents(events, (event) => {
		if (event.type === Event.PlaybackState && syncWithAudio) {
			if (event.state === State.Playing) {
				player.currentTime = position;
			}
			if (event.state === State.Paused) {
				// player.pause();
			}
		}
	});

	// useEffect(() => {
	// 	const subscription = player.addListener('playingChange', (isPlaying) => {
	// 		setIsPlaying(isPlaying);
	// 	});

	// 	return () => {
	// 		subscription.remove();
	// 	};
	// }, [player]);

	return (
		<View
			style={{
				position: 'absolute',
				width: '100%',
				height: fullscreen ? height : VIDEO_SIZE,
			}}>
			<VideoView
				ref={ref}
				style={{ width: '100%', height: fullscreen ? height : VIDEO_SIZE }}
				player={player}
				allowsFullscreen={false}
				allowsPictureInPicture={false}
				nativeControls={false}
				contentFit={'cover'}
			/>
			<LinearGradient
				style={{
					position: 'absolute',
					width: '100%',
					height: fullscreen ? height + top + bottom : VIDEO_SIZE,
				}}
				colors={[dark ? 'rgba(0,0,0,.8)' : 'rgba(255,255,255,0.6)', colors.surface]}
				// locations={[0, 0.5]}
				start={{ x: 0.5, y: 0.0 }}
				end={{ x: 0.5, y: 1.0 }}
			/>
		</View>
	);
};

export const ImageBackground = ({
	source,
	size = 350,
	fullscreen = false,
}: {
	source: string | undefined;
	size?: DimensionValue | undefined;
	fullscreen?: boolean;
}) => {
	const { colors, dark } = useTheme();
	const { height, width } = useWindowDimensions();

	return (
		<View style={{ position: 'absolute', width: width }}>
			<Image
				source={{ uri: source }}
				contentFit="cover"
				style={{ width: '100%', height: fullscreen ? height : size }}
				blurRadius={1}
			/>
			<LinearGradient
				style={{ position: 'absolute', width: '100%', height: fullscreen ? height : size }}
				colors={[dark ? 'rgba(0,0,0,.8)' : 'rgba(255,255,255,0.6)', colors.surface]}
				// locations={[0, 0.5]}
				start={{ x: 0.5, y: 0.0 }}
				end={{ x: 0.5, y: 1.0 }}
			/>
		</View>
	);
};
