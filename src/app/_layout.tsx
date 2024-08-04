import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from 'react-native-track-player';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Toaster } from 'burnt/web';
import { PaperThemeProvider } from '../providers/theme';
import { UpdaterBottomSheet } from '../components/bottomsheets';
import useAppUpdates from '../hooks/useAppUpdates';
import { reattachDownloads, removeUpdateAPKs } from '../utils/update';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { PaperHeader } from '../components/headers';
import { useLastTrackStore } from '../store/lastTrack';

TrackPlayer.registerPlaybackService(() => require('../service'));

Platform.OS !== 'web' && removeUpdateAPKs();
Platform.OS !== 'web' && reattachDownloads();

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
	const [loaded, error] = useFonts({
		'Satoshi-Regular': require('../../assets/fonts/Satoshi-Regular.otf'),
	});
	const updaterBtmSheetRef = useRef<BottomSheetModal>(null);
	const { updateDetails, checkForUpdates } = useAppUpdates();
	const { track, position } = useLastTrackStore();

	const runInitialSetup = async () => {
		await TrackPlayer.setupPlayer();
		await TrackPlayer.updateOptions({
			android: {
				appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
			},
			notificationCapabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SkipToNext,
				Capability.SkipToPrevious,
				Capability.SeekTo,
			],
			capabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SkipToNext,
				Capability.SkipToPrevious,
				Capability.SeekTo,
			],
			icon: require('../../assets/images/adaptive-icon.png'),
		});
		track && (await TrackPlayer.load(track));
		position && (await TrackPlayer.seekTo(position));
	};

	const runUpdateChecker = async () => {
		const hasUpdate = await checkForUpdates();
		if (hasUpdate) {
			updaterBtmSheetRef.current?.present();
		}
	};

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	useEffect(() => {
		runInitialSetup();
		Platform.OS !== 'web' && runUpdateChecker();
	}, []);

	return (
		<PaperThemeProvider>
			<QueryClientProvider client={queryClient}>
				<GestureHandlerRootView>
					<BottomSheetModalProvider>
						<Stack>
							<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
							<Stack.Screen
								name="player"
								options={{
									headerShown: false,
									presentation: 'fullScreenModal',
									animation: 'slide_from_bottom',
									animationTypeForReplace: 'push',
								}}
							/>
							<Stack.Screen
								name={'create'}
								options={{
									header: (props) => <PaperHeader {...props} />,
									presentation: 'fullScreenModal',
									animation: 'slide_from_bottom',
									animationTypeForReplace: 'push',
									title: 'Create Playlist',
								}}
							/>
						</Stack>
						<Toaster position="bottom-right" />
						{Platform.OS !== 'web' && (
							<UpdaterBottomSheet
								ref={updaterBtmSheetRef}
								updateDetails={updateDetails}
							/>
						)}
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
			</QueryClientProvider>
		</PaperThemeProvider>
	);
};

export default RootLayout;
