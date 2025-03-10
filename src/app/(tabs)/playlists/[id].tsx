import { ImageBackground } from '@/src/components/background';
import { SongBottomSheet } from '@/src/components/bottomsheets';
import { AnimHeader } from '@/src/components/headers';
import { StackView } from '@/src/components/view';
import { BLURHASH } from '@/src/constants';
import { useHeaderAnim } from '@/src/hooks/useHeaderFade';
import { usePlaylistStore } from '@/src/store/playlists';
import { CustomTrack } from '@/src/types';
import { getPlaylistImage } from '@/src/utils/upload';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { FlatList, ListRenderItemInfo, Pressable, View } from 'react-native';
import { List, Text } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrackPlayer from 'react-native-track-player';

const PlaylistHeading = ({ id }: { id: number }) => {
	const { playlists, editPlaylistDetails } = usePlaylistStore();

	const onCoverEdit = async () => {
		const newCover = await getPlaylistImage();
		if (newCover) {
			editPlaylistDetails(id, playlists[id].title, playlists[id].description, newCover);
		}
	};

	return (
		<View>
			<ImageBackground source={playlists[0].coverImg} />
			<SafeAreaView style={{ paddingTop: 75 }}>
				<View style={{ paddingHorizontal: 20 }}>
					<View
						style={{
							width: '100%',
							flexDirection: 'row',
							justifyContent: 'center',
							// paddingHorizontal: 20,
							alignItems: 'center',
						}}>
						<Pressable onPress={onCoverEdit}>
							<Image
								source={{ uri: playlists[id].coverImg }}
								placeholder={{ blurhash: BLURHASH }}
								style={{
									aspectRatio: 1,
									width: undefined,
									height: 160,
									borderRadius: 6,
								}}
								contentFit="cover"
							/>
						</Pressable>
					</View>
					<View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
						<Text variant="titleLarge">{playlists[id].title}</Text>
					</View>
					{playlists[id].description && (
						<Text style={{ paddingVertical: 16 }}>{playlists[id].description}</Text>
					)}
				</View>
				<View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
					<Text variant="titleMedium">
						{playlists[id].tracks?.length} Theme
						{playlists[id].tracks.length > 1 || playlists[id].tracks.length < 1
							? 's'
							: ''}
					</Text>
				</View>
			</SafeAreaView>
		</View>
	);
};

const PlaylistItem = (
	props: ListRenderItemInfo<CustomTrack> & { onSelect: () => void; onLongSelect: () => void },
) => {
	return (
		<List.Item
			title={props.item.title ?? 'test'}
			description={props.item.artist ?? 'Unknown'}
			onPress={props.onSelect}
			onLongPress={props.onLongSelect}
			right={(rightProps) => (
				<View style={[rightProps.style, { flexDirection: 'row' }]}>
					{/* <List.Icon {...rightProps} icon={'play'} /> */}
					<Pressable onPress={props.onLongSelect}>
						<List.Icon {...rightProps} icon={'dots-vertical'} />
					</Pressable>
				</View>
			)}
			left={(leftProps) => <List.Image {...leftProps} source={{ uri: props.item.artwork }} />}
		/>
	);
};

const PlaylistPage = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { playlists } = usePlaylistStore();
	const headerAnim = useHeaderAnim();
	const listRef = useRef<FlatList>(null);
	const trackBtmSheetRef = useRef<BottomSheetModal>(null);
	const [selectedTrack, setSelectedTrack] = useState<CustomTrack>();

	const playlistID = id ? parseInt(id) : 0;

	const renderItem = useCallback(
		(props: ListRenderItemInfo<CustomTrack>) => (
			<PlaylistItem
				{...props}
				onSelect={async () => {
					await TrackPlayer.load(props.item);
					await TrackPlayer.play();
				}}
				onLongSelect={() => {
					setSelectedTrack(props.item);
					trackBtmSheetRef.current?.present();
				}}
			/>
		),
		[],
	);

	const listHeaderComponent = useCallback(
		() => <PlaylistHeading id={playlistID} />,
		[playlistID],
	);

	return (
		<StackView>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTransparent: true,
					header: (props) => <AnimHeader {...props} {...headerAnim} />,
				}}
			/>
			<View>
				{/* {data && <AnimeHeader data={data} />} */}
				<Animated.FlatList
					ref={listRef}
					data={playlists[playlistID]?.tracks.reverse()}
					renderItem={renderItem}
					keyExtractor={(_, idx) => idx.toString()}
					ListHeaderComponent={listHeaderComponent}
					contentContainerStyle={{ paddingBottom: 100 }}
					onScroll={headerAnim.scrollHandler}
				/>
				{/* <Button onPress={() => console.log(themes)}>PRINT PARAMS</Button> */}
			</View>
			<SongBottomSheet
				ref={trackBtmSheetRef}
				track={selectedTrack}
				playlistId={playlistID}
				onPlaylistAdd={() => null}
			/>
		</StackView>
	);
};

export default PlaylistPage;
