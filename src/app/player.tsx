import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { IconButton, Surface, Text, useTheme } from 'react-native-paper';
import TrackPlayer, {
	Event,
	RepeatMode,
	State,
	useActiveTrack,
	useIsPlaying,
	usePlaybackState,
	useProgress,
	useTrackPlayerEvents,
} from 'react-native-track-player';
import { CustomTrack } from '../types';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoBackground } from '../components/background';
import { useEffect, useMemo, useRef, useState } from 'react';
import { copyToClipboard } from '../utils/text';
import { Image } from 'expo-image';
import { PlayerBottomSheet, PlaylistsAddBottomSheet } from '../components/bottomsheets';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { PlayerTrackSlider } from '../components/slider';
import { TrackController } from '../components/controls';
import { usePlaylistStore } from '../store/playlists';

const events = [
	Event.PlaybackState,
	Event.PlaybackError,
	Event.RemotePlay,
	Event.RemotePause,
	// Event.RemoteStop,
];

// NEED TO FIX SYNC WITH VIDEO PLAYER
// ITS A BIT SUS SO ITLL HAVE TO WAIT
// theres also little control over fullscreen video...

// also not sure yet on a design that allows for both audio and video (esp. when it comes to playing in background)

// maybe just pause audio when viewing the video :/

const PlayerModalPage = () => {
	const { height } = useWindowDimensions();
	const playerBottomSheetRef = useRef<BottomSheetModal>(null);
	const playlistAddBtmSheetRef = useRef<BottomSheetModal>(null);
	// const vidRef = useRef<VideoView>(null);
	const { colors } = useTheme();
	const { state } = usePlaybackState();
	const activeTrack = useActiveTrack() as CustomTrack | undefined;
	const { position, duration, buffered } = useProgress();
	const { playing, bufferingDuringPlay } = useIsPlaying();
	const [repeatModeStatus, setRepeatModeStatus] = useState<RepeatMode>();
	const { playlists } = usePlaylistStore();

	// const [isFullscreen, setIsFullscreen] = useState(false);

	const hasPrevious = useMemo(() => {
		let allowSkip = false;
		if (activeTrack) {
			TrackPlayer.getActiveTrackIndex().then((idx) => {
				if (idx) {
					allowSkip = idx > 0;
				}
			});
		}

		return allowSkip;
	}, [activeTrack]);

	// const vidPlayer = useVideoPlayer(activeTrack?.videoUrl ?? '', (player) => {
	// 	player.muted = true;
	// 	player.showNowPlayingNotification = false;
	// 	player.staysActiveInBackground = false;
	// });

	const togglePlay = async () => {
		if (state === State.Playing) {
			// vidPlayer.pause();
			await TrackPlayer.pause();
		} else {
			// vidPlayer.currentTime = position;
			if (state === State.Ended) {
				await TrackPlayer.seekTo(0);
			}
			await TrackPlayer.play();
			// vidPlayer.play();
		}
	};

	const onSeek = async (value: number) => {
		// vidPlayer.currentTime = value;
		await TrackPlayer.seekTo(value);
	};

	const onPrevTrack = async () => {
		await TrackPlayer.skipToPrevious();
		await TrackPlayer.play();
	};

	const onNextTrack = async () => {
		await TrackPlayer.skipToNext();
		await TrackPlayer.play();
	};

	const toggleRepeatMode = async () => {
		const repeatMode = await TrackPlayer.getRepeatMode();
		await TrackPlayer.setRepeatMode(
			repeatMode === RepeatMode.Off ? RepeatMode.Track : RepeatMode.Off,
		);
		// setRepeatMode outputs null (idk why) so we call getRepeatMode again
		setRepeatModeStatus(await TrackPlayer.getRepeatMode());
	};

	const onBack = () => {
		// vidPlayer.pause();
		router.back();
	};

	// const openFullscreen = () => {
	// 	setIsFullscreen(true);
	// 	vidRef?.current?.enterFullscreen();
	// 	// console.log(vidRef?.current?.);
	// };

	useTrackPlayerEvents(events, (event) => {
		if (event.type === Event.PlaybackError) {
			console.warn('An error occured while playing the current track.');
		}
		// if (event.type === Event.RemotePlay) {
		// 	vidPlayer.currentTime = position;
		// 	vidPlayer.play();
		// }
		// if (event.type === Event.RemotePause) {
		// 	vidPlayer.pause();
		// }
	});

	useEffect(() => {
		TrackPlayer.getRepeatMode().then((mode) => setRepeatModeStatus(mode));
	}, []);

	// useEffect(() => {
	// 	const subscription = vidPlayer.addListener('playingChange', (newIsPlaying) => {
	// 		if (isFullscreen) {
	// 			if (newIsPlaying) {
	// 				// vidRef?.current?.state
	// 				TrackPlayer.play();
	// 			} else {
	// 				TrackPlayer.pause();
	// 			}
	// 		}
	// 	});

	// 	return () => {
	// 		subscription.remove();
	// 	};
	// }, [vidPlayer, isFullscreen]);

	return (
		<View style={{ flex: 1 }}>
			{/* <ImageBackground source={activeTrack?.artwork} fullscreen /> */}
			<VideoBackground source={activeTrack?.videoUrl ?? ''} fullscreen />
			<SafeAreaView
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}>
				<IconButton
					icon="chevron-down"
					size={32}
					onPress={onBack}
					iconColor={colors.onSurface}
				/>
				<View style={{ alignItems: 'center', flex: 1 }}>
					<Text style={{ fontWeight: '900' }}>{activeTrack?.animetheme?.slug}</Text>
					<Text numberOfLines={1}>{activeTrack?.title}</Text>
				</View>
				<IconButton
					icon="dots-vertical"
					size={32}
					onPress={() => playerBottomSheetRef.current?.present()}
					iconColor={colors.onSurface}
				/>
			</SafeAreaView>
			<ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
				<View>
					<View style={{ alignItems: 'center', justifyContent: 'center' }}>
						<View style={{ height: height * 0.6 }} />
						<View
							style={{
								width: '100%',
								flexDirection: 'row',
								justifyContent: 'space-between',
								padding: 10,
							}}>
							<View
								style={{
									alignSelf: 'flex-start',
									alignItems: 'flex-start',
									flexShrink: 1,
									paddingHorizontal: 10,
								}}>
								<Text
									variant="titleLarge"
									numberOfLines={3}
									onLongPress={() => copyToClipboard(activeTrack?.title)}
									style={{ fontWeight: '900' }}>
									{activeTrack?.title}
								</Text>
								<Text style={{ color: colors.onSurfaceVariant }}>
									{activeTrack?.artist}
								</Text>
							</View>
							<IconButton
								icon={
									playlists.some((playlist) =>
										playlist.tracks.some((val) => val.url === activeTrack?.url),
									)
										? 'check-circle'
										: 'plus'
								}
								onPress={() => playlistAddBtmSheetRef.current?.present()}
							/>
						</View>
						{/* <VideoView
							ref={vidRef}
							player={vidPlayer}
							style={{
								aspectRatio: 16 / 9,
								width: '100%',
								height: undefined,
								backgroundColor: 'transparent',
							}}
							allowsFullscreen
							allowsPictureInPicture={false}
							nativeControls={false}
							contentFit="contain"
							onLayout={(event) =>
								console.log('Vid Layout:', event.nativeEvent.layout.height)
							}
						/> */}
						{/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
							<IconButton icon="fullscreen" size={32} onPress={openFullscreen} />
						</View> */}
					</View>
					<View>
						<PlayerTrackSlider
							duration={duration}
							buffered={buffered}
							onSeek={onSeek}
							position={position}
						/>
						<TrackController
							playing={playing}
							repeatModeStatus={repeatModeStatus}
							bufferingDuringPlay={bufferingDuringPlay}
							hasPrevious={hasPrevious}
							onNextTrack={onNextTrack}
							onPrevTrack={onPrevTrack}
							togglePlay={togglePlay}
							toggleRepeatMode={toggleRepeatMode}
						/>
					</View>
				</View>
				{activeTrack?.artistsData && activeTrack.artistsData.length > 0 && (
					<View style={{ paddingHorizontal: 20 }}>
						<Text
							variant="titleMedium"
							style={{ fontWeight: '900', paddingHorizontal: 5 }}>
							Artists
						</Text>
						{activeTrack?.artistsData?.map((artist, idx) => (
							<Surface
								key={idx}
								mode="elevated"
								style={{ padding: 5, borderRadius: 12, marginVertical: 6 }}>
								<Pressable
									onPress={() =>
										router.navigate({
											pathname: 'artist/[artistSlug]',
											params: { artistSlug: artist.slug },
										})
									}>
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<View style={{ flex: 1, paddingHorizontal: 10 }}>
											<Text variant="titleMedium">{artist?.name}</Text>
											{/* <Text
											variant="labelMedium"
											style={{ color: colors.onSurfaceVariant }}>
											{`${artist?.slug}`}
										</Text> */}
										</View>
									</View>
								</Pressable>
							</Surface>
						))}
					</View>
				)}
				<View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
					<Text variant="titleMedium" style={{ fontWeight: '900', paddingHorizontal: 5 }}>
						Anime
					</Text>
					<Surface mode="elevated" style={{ padding: 5, borderRadius: 12 }}>
						<Pressable
							onPress={() =>
								router.navigate({
									pathname: '/anime/[slug]',
									params: { slug: activeTrack?.anime?.slug },
								})
							}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Image
									source={{ uri: activeTrack?.artwork ?? undefined }}
									style={{
										width: undefined,
										height: 120,
										aspectRatio: 2 / 3,
										borderRadius: 8,
									}}
									contentFit="contain"
								/>
								<View style={{ flex: 1, paddingHorizontal: 10 }}>
									<Text variant="titleMedium">{activeTrack?.anime?.name}</Text>
									<Text
										variant="labelMedium"
										style={{ color: colors.onSurfaceVariant }}>
										{`${activeTrack?.anime?.media_format} ・ ${activeTrack?.anime?.season} ${activeTrack?.anime?.year}`}
									</Text>
								</View>
							</View>
						</Pressable>
					</Surface>
				</View>
			</ScrollView>
			<PlayerBottomSheet ref={playerBottomSheetRef} track={activeTrack} />
			<PlaylistsAddBottomSheet ref={playlistAddBtmSheetRef} track={activeTrack} />
		</View>
	);
};

export default PlayerModalPage;
