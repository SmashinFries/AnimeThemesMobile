import { useArtist } from '@/src/api/queries/hooks';
import { router } from 'expo-router';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import { Avatar, Button, Chip, IconButton, List, Surface, Text } from 'react-native-paper';
import { LoadingView } from '../view';
import { AnimHeaderFlatlist } from '../list';
import { ArtistResponse } from '@/src/api/queries/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageBackground } from '../background';
import { openWebBrowser } from '@/src/utils/browser';
import { sendToast } from '@/src/utils/toasts';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { CustomTrack } from '@/src/types';
import TrackPlayer from 'react-native-track-player';
import { SongBottomSheet } from '../bottomsheets';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const ArtistHeader = ({ data }: { data: ArtistResponse | undefined }) => {
	const { top } = useSafeAreaInsets();
	return (
		<View style={{ alignItems: 'center', paddingTop: top + 80 }}>
			<ImageBackground
				source={data?.artist?.images?.find((img) => img.facet === 'Large Cover')?.link}
			/>
			<Avatar.Image
				source={{
					uri: data?.artist?.images?.find((img) => img.facet === 'Large Cover')?.link,
				}}
				size={150}
			/>
			<Text
				variant="titleLarge"
				style={{ fontWeight: '900', paddingTop: 5, marginBottom: 10 }}>
				{data?.artist?.name}
			</Text>
			{data?.artist?.members && data?.artist?.members.length > 0 && (
				<View style={{ flex: 1, width: '100%', paddingVertical: 5 }}>
					<Text variant="titleMedium" style={{ paddingLeft: 10 }}>
						Members
					</Text>
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{data?.artist?.members?.map((member, idx) => (
							<Chip
								key={idx}
								mode="outlined"
								onPress={() =>
									router.push({
										pathname: '/artist/[artistSlug]',
										params: { artistSlug: member.slug },
									})
								}
								style={{ margin: 5 }}>
								{member.name}
							</Chip>
						))}
					</ScrollView>
				</View>
			)}
			{data && data.artist?.resources?.length > 0 && (
				<View style={{ flex: 1, width: '100%', paddingVertical: 5 }}>
					<Text variant="titleMedium" style={{ paddingLeft: 10 }}>
						Links
					</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ paddingLeft: 10 }}>
						{data.artist.resources.map((resource, idx) => (
							<Chip
								key={idx}
								mode={'outlined'}
								onPress={() => openWebBrowser(resource.link)}
								style={{ margin: 5 }}>
								{resource.site}
							</Chip>
						))}
					</ScrollView>
				</View>
			)}
			<View
				style={{
					width: '100%',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginTop: 30,
					marginBottom: 10,
					paddingLeft: 10,
				}}>
				<Text variant="titleMedium">
					Song Performances {`(${data?.artist?.songs?.length})`}
				</Text>
				<IconButton icon={'filter-outline'} onPress={() => sendToast('Working on it!')} />
			</View>
		</View>
	);
};

const ArtistPage = ({ slug }: { slug: string | undefined }) => {
	const { data, isFetching } = useArtist(slug);
	const [selectedTrack, setSelectedTrack] = useState<CustomTrack>();
	const bottomSheetRef = useRef<BottomSheetModal>(null);

	const playTrack = async (track: CustomTrack) => {
		await TrackPlayer.load(track);
		TrackPlayer.play();
	};

	const onSheetOpen = (track: CustomTrack) => {
		setSelectedTrack(track);
		bottomSheetRef.current?.present();
	};

	const renderItem = ({ item }: { item: ArtistResponse['artist']['songs'][0] }) => {
		const track: CustomTrack = {
			url: item.animethemes[0].animethemeentries[0].videos[0].audio.link,
			title: item.title,
			anime: { ...item.animethemes[0].anime },
			animetheme: {
				slug: item.animethemes[0].slug,
				type: item.animethemes[0].type,
			},
			artist: data?.artist.name,
			artwork: item.animethemes[0].anime.images.find((img) => img.facet === 'Large Cover')
				?.link,
			videoUrl: item.animethemes[0].animethemeentries[0].videos[0].link,
			artistsData: item.artists,
		};
		return (
			<Surface
				style={{
					flex: 1,
					marginVertical: 10,
					padding: 10,
					borderRadius: 8,
					marginHorizontal: 10,
				}}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<View style={{ flex: 1, flexDirection: 'row' }}>
						<Pressable
							onPress={() =>
								router.push({
									pathname: '/anime/[slug]',
									params: { slug: item.animethemes[0]?.anime.slug },
								})
							}>
							<Image
								source={{
									uri: item.animethemes[0].anime.images.find(
										(img) => img.facet === 'Large Cover',
									)?.link,
								}}
								style={{
									borderRadius: 8,
									aspectRatio: 1 / 1,
									width: undefined,
									height: 60,
								}}
							/>
						</Pressable>
						<Pressable
							onPress={async () => await playTrack(track)}
							style={{ flex: 1, justifyContent: 'center' }}>
							<View
								style={{
									paddingHorizontal: 10,
									justifyContent: 'center',
								}}>
								<Text variant="titleSmall" style={{ flex: 1, fontWeight: '900' }}>
									{item.title}
								</Text>
								<Text style={{ flex: 1 }} numberOfLines={1} variant="labelMedium">
									{item.animethemes[0]?.slug} ・ {item.animethemes[0].anime.name}
								</Text>
							</View>
						</Pressable>
					</View>
					<View style={{ flexShrink: 1, flexDirection: 'row' }}>
						<IconButton icon="dots-vertical" onPress={() => onSheetOpen(track)} />
					</View>
				</View>
			</Surface>
		);
	};

	return (
		<LoadingView isLoading={isFetching}>
			{/* <Stack.Screen options={{ headerShown: true, title: data?.artist?.name ?? '' }} /> */}

			<AnimHeaderFlatlist
				fadeStart={150 + 40}
				fadeEnd={150 + 80}
				headerTitle={data?.artist?.name ?? ''}
				ListHeaderComponent={() => <ArtistHeader data={data} />}
				data={data?.artist?.songs}
				renderItem={renderItem}
				keyExtractor={(_, idx) => idx.toString()}
				shareLink={`https://animethemes.moe/artist/${slug}`}
				contentContainerStyle={{ paddingBottom: 80 }}
			/>
			{/* <FlatList
                data={data?.artist.songs}

            /> */}
			<SongBottomSheet ref={bottomSheetRef} track={selectedTrack} />
		</LoadingView>
	);
};

export default ArtistPage;
