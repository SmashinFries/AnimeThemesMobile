import { useDiscover, useMostViewed, useRecentlyAdded } from '@/src/api/queries/hooks';
import { ExploreDataTracks } from '@/src/api/queries/types';
import { PlaylistsAddBottomSheet, SongBottomSheet } from '@/src/components/bottomsheets';
import { SongBoxCard } from '@/src/components/cards';
import { StackView } from '@/src/components/view';
import { CustomTrack } from '@/src/types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrackPlayer from 'react-native-track-player';
import { useNetInfo } from '@react-native-community/netinfo';
import Animated, { FadeIn } from 'react-native-reanimated';

type HomeSectionProps = {
	title: string;
	tracks: CustomTrack[] | undefined;
	videos: ExploreDataTracks['videos'] | undefined;
	onPress: (track: CustomTrack) => void;
	onLongPress: (track: CustomTrack) => void;
};
const HomeSection = ({ title, tracks, videos, onPress, onLongPress }: HomeSectionProps) => {
	return (
		<Animated.View entering={FadeIn}>
			<Text
				variant="headlineMedium"
				style={{
					fontFamily: 'Satoshi-Regular',
					fontWeight: 'bold',
					paddingLeft: 10,
					paddingVertical: 10,
				}}>
				{title}
			</Text>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={{ minHeight: 160 }}>
				{tracks?.map((track, idx) => (
					<SongBoxCard
						key={idx}
						track={track}
						videoBasename={videos ? videos[idx]?.basename : ''}
						onPress={() => onPress(track)}
						onLongPress={() => onLongPress(track)}
					/>
				))}
			</ScrollView>
		</Animated.View>
	);
};

const HomePage = () => {
	const btmSheetRef = useRef<BottomSheetModal>(null);
	const playlistAddSheetRef = useRef<BottomSheetModal>(null);
	const [selectedTrack, setSelectedTrack] = useState<CustomTrack>();
	const discover = useDiscover();
	const recentlyAdded = useRecentlyAdded();
	const mostViewed = useMostViewed();
	const { isInternetReachable } = useNetInfo();

	const addTrack = async (track: CustomTrack) => {
		// await TrackPlayer.reset();
		await TrackPlayer.load(track);
		await TrackPlayer.play();
	};

	const openSheet = (track: CustomTrack) => {
		setSelectedTrack(track);
		btmSheetRef.current?.present();
	};

	return (
		<StackView>
			{isInternetReachable ? (
				<ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
					<SafeAreaView style={{ paddingTop: 20 }}>
						<HomeSection
							title="Random"
							tracks={discover?.data?.tracks}
							onPress={addTrack}
							onLongPress={(track) => openSheet(track)}
							videos={discover?.data?.videos}
						/>
						<HomeSection
							title="Recently Added"
							tracks={recentlyAdded?.data?.tracks}
							onPress={addTrack}
							videos={recentlyAdded?.data?.videos}
							onLongPress={(track) => openSheet(track)}
						/>
						<HomeSection
							title="Most Viewed"
							tracks={mostViewed?.data?.tracks}
							onPress={addTrack}
							videos={mostViewed?.data?.videos}
							onLongPress={(track) => openSheet(track)}
						/>
					</SafeAreaView>
				</ScrollView>
			) : (
				<View>
					<Text>Running in offline mode!</Text>
				</View>
			)}
			<SongBottomSheet
				ref={btmSheetRef}
				track={selectedTrack}
				onPlaylistAdd={() => playlistAddSheetRef.current?.present()}
			/>
			<PlaylistsAddBottomSheet ref={playlistAddSheetRef} track={selectedTrack} />
		</StackView>
	);
};

export default HomePage;
