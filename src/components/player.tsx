import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, View } from 'react-native';
import { IconButton, ProgressBar, Text, useTheme } from 'react-native-paper';
import Animated, { FadeIn, FadeOut, useSharedValue, withTiming } from 'react-native-reanimated';
import TrackPlayer, {
	State,
	useActiveTrack,
	useIsPlaying,
	usePlaybackState,
	useProgress,
} from 'react-native-track-player';
import { useLastTrackStore } from '../store/lastTrack';
import { CustomTrack } from '../types';
import { PlaylistsAddBottomSheet } from './bottomsheets';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export const GlobalPlayer = () => {
	const { colors } = useTheme();
	const { state } = usePlaybackState();
	const { playing, bufferingDuringPlay } = useIsPlaying();
	const { track, position: lastPos } = useLastTrackStore();
	// const [currentTrack, setCurrentTrack] = useState<CustomTrack | undefined>(track as CustomTrack);
	const activeTrack = useActiveTrack();
	const { position, duration } = useProgress();
	const [containerWidth, setContainerWidth] = useState(0);
	const playlistAddBtmSheetRef = useRef<BottomSheetModal>(null);

	const marginBottomAnim = useSharedValue(90);

	useEffect(() => {
		const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
			marginBottomAnim.value = withTiming(0);
		});
		const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
			marginBottomAnim.value = withTiming(90);
		});

		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, []);

	const onPlay = async () => {
		if (state === State.Playing) {
			await TrackPlayer.pause();
		} else if (state && [State.Paused, State.Ready, State.Buffering].includes(state)) {
			await TrackPlayer.play();
		} else if (state === State.Ended) {
			const queue = await TrackPlayer.getQueue();
			const currentIdx = await TrackPlayer.getActiveTrackIndex();
			if (currentIdx && queue[currentIdx + 1]) {
				await TrackPlayer.skipToNext();
			} else {
				await TrackPlayer.seekTo(0);
				await TrackPlayer.play();
			}
		}
	};

	// useEffect(() => {
	// 	if (activeTrack === undefined && state !== undefined) {
	// 		if (track) {
	// 			console.log('Found prev Track');
	// 			TrackPlayer.add([track]);
	// 			setCurrentTrack(track);
	// 		} else {
	// 			console.log('No prev Track');
	// 			TrackPlayer.getActiveTrack().then((track) => {
	// 				track && setCurrentTrack(track);
	// 			});
	// 		}
	// 	} else if (track && activeTrack === undefined) {
	// 		console.log('Found prev Track');
	// 		TrackPlayer.add([track]);
	// 		setCurrentTrack(track);
	// 	}
	// }, [state, activeTrack, track]);

	// useEffect(() => {
	// 	setCurrentTrack(activeTrack);
	// }, [activeTrack]);

	// useEffect(() => {
	// 	console.log('Current Track:', currentTrack);
	// }, [currentTrack]);

	// if (!activeTrack && !track) return null;

	return (
		<>
			{activeTrack && (
				<Animated.View
					entering={FadeIn}
					exiting={FadeOut}
					style={{
						alignSelf: 'center',
						borderRadius: 8,
						position: 'absolute',
						width: '95%',
						bottom: 0,
						marginBottom: marginBottomAnim,
						// height: 85,
						padding: 5,
						backgroundColor: colors.surfaceVariant,
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<View
						onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
						style={{
							width: '100%',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						<Pressable
							onPress={() => router.navigate('/player')}
							style={{ flex: 1, flexDirection: 'row', paddingBottom: 5 }}>
							<Image
								source={activeTrack?.artwork && { uri: activeTrack?.artwork }}
								style={{ height: 50, width: 50, borderRadius: 8 }}
							/>
							<View
								style={{
									paddingHorizontal: 10,
									justifyContent: 'center',
									flexShrink: 1,
								}}>
								<Text variant="labelMedium" style={{ fontWeight: '900' }}>
									{activeTrack?.title}
								</Text>
								<Text
									variant="labelSmall"
									numberOfLines={1}
									style={{
										color: colors.onSurfaceVariant,
									}}>
									{activeTrack?.artist && activeTrack?.artist?.length > 0
										? activeTrack?.artist
										: 'Unknown'}
								</Text>
							</View>
						</Pressable>
						<View style={{ flexDirection: 'row' }}>
							<IconButton
								icon={'plus'}
								// disabled
								onPress={() => playlistAddBtmSheetRef.current?.present()}
							/>
							<IconButton
								icon={state === State.Playing ? 'pause' : 'play'}
								onPress={onPlay}
							/>
						</View>
					</View>
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<ProgressBar
							progress={position > 0 && duration > 0 ? position / duration : 0}
							indeterminate={state === State.Loading || bufferingDuringPlay}
							style={{
								width: containerWidth,
								borderRadius: 12,
								backgroundColor: colors.backdrop,
							}}
						/>
					</View>
				</Animated.View>
			)}
			<PlaylistsAddBottomSheet ref={playlistAddBtmSheetRef} track={activeTrack} />
		</>
	);
};

export default GlobalPlayer;
