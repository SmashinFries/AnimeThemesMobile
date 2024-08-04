import {
	useSearchAll,
	useSearchAnime,
	useSearchArtists,
	useSearchThemes,
} from '@/src/api/queries/hooks';
import {
	SearchAllResponse,
	SearchAnimeResponse,
	SearchArtistsResponse,
	SearchThemesResponse,
} from '@/src/api/queries/types';
import { PlaylistsAddBottomSheet, SongBottomSheet } from '@/src/components/bottomsheets';
import { SearchItem } from '@/src/components/cards';
import { LoadingView, StackView } from '@/src/components/view';
import { BLURHASH } from '@/src/constants';
import useDebounce from '@/src/hooks/useDebounce';
import { CustomTrack } from '@/src/types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, Pressable, SectionList, SectionListProps, View } from 'react-native';
import {
	IconButton,
	Searchbar,
	SegmentedButtons,
	SegmentedButtonsProps,
	Surface,
	Text,
	useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackPlayer from 'react-native-track-player';

type Categories = 'all' | 'anime' | 'animetheme' | 'artist';

const buttons: SegmentedButtonsProps['buttons'] = [
	{
		value: 'all',
		label: 'All',
	},
	{
		value: 'anime',
		label: 'Anime',
	},
	{
		value: 'animetheme',
		label: 'Themes',
	},
	{
		value: 'artist',
		label: 'Artists',
	},
];

// type SearchItemProps = {
// 	title: string;
// 	type: string;
// 	onPress: () => void;
// 	onLongPress?: () => void;
// 	imageUrl?: string;
// 	details?: string;
// };
// const SearchItem = ({ title, type, details, imageUrl, onPress, onLongPress }: SearchItemProps) => {
// 	const { colors } = useTheme();

// 	return (
// 		<Surface
// 			style={{ padding: 5, borderRadius: 8, justifyContent: 'center', marginVertical: 6 }}>
// 			<Pressable onPress={onPress} onLongPress={onLongPress}>
// 				<View style={{ flexDirection: 'row' }}>
// 					<Image
// 						source={{ uri: imageUrl }}
// 						style={{
// 							aspectRatio: 1 / 1,
// 							width: undefined,
// 							height: 80,
// 							borderRadius: 12,
// 						}}
// 						placeholder={{ blurhash: BLURHASH }}
// 						contentFit="cover"
// 					/>
// 					<View style={{ flex: 1, paddingHorizontal: 10, justifyContent: 'center' }}>
// 						<Text variant="titleMedium" numberOfLines={2} style={{ fontWeight: '900' }}>
// 							{title}
// 						</Text>
// 						<Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>
// 							{type}
// 							{details ? ` ・ ${details}` : ''}
// 						</Text>
// 					</View>
// 					<IconButton
// 						icon={'dots-vertical'}
// 						style={{ alignSelf: 'center' }}
// 						onPress={onLongPress}
// 					/>
// 				</View>
// 			</Pressable>
// 		</Surface>
// 	);
// };

type AllListProps = {
	data?: SearchAllResponse | undefined;
	header?: SectionListProps<any>['ListHeaderComponent'];
	isFetching?: boolean;
	onTrackSelect: (track: CustomTrack) => void;
};
const AllList = ({ data, header, isFetching, onTrackSelect }: AllListProps) => {
	const renderAnimeItem = ({ item }: { item: SearchAllResponse['search']['anime'][0] }) => {
		return (
			<SearchItem
				title={item.name}
				details={`${item.media_format} ・ ${item.season} ${item.year}`}
				type="Anime"
				imageUrl={item.images[0]?.link}
				onPress={() =>
					router.navigate({
						pathname: '/(tabs)/search/anime/[slug]',
						params: { slug: item.slug },
					})
				}
			/>
		);
	};
	const renderAnimeThemeItem = ({
		item,
	}: {
		item: SearchAllResponse['search']['animethemes'][0];
	}) => {
		return (
			<SearchItem
				title={item.song.title}
				type={item.slug}
				onPress={async () => {
					if (item.track) {
						await TrackPlayer.load(item.track);
						TrackPlayer.play();
					}
				}}
				onLongPress={() => item.track && onTrackSelect(item.track)}
				details={
					item.song.artists.length > 0
						? `by ${item.song.artists?.map((artist) => artist.name).join(', ')}`
						: undefined
				}
				imageUrl={item.anime.images[0]?.link}
			/>
		);
	};
	const renderArtistItem = ({ item }: { item: SearchAllResponse['search']['artists'][0] }) => {
		return (
			<SearchItem
				title={item.name}
				type="Artist"
				onPress={() =>
					router.navigate({
						pathname: '/(tabs)/search/artist/[artistSlug]',
						params: { artistSlug: item.slug },
					})
				}
				imageUrl={item.images[0]?.link}
			/>
		);
	};
	const sections = [
		{
			title: 'Anime',
			data: data?.search?.anime ?? [],
			renderItem: renderAnimeItem,
		},
		{
			title: 'Themes',
			data: data?.search?.animethemes ?? [],
			renderItem: renderAnimeThemeItem,
		},
		{
			title: 'Artists',
			data: data?.search?.artists ?? [],
			renderItem: renderArtistItem,
		},
	];

	return (
		<LoadingView isLoading={isFetching === undefined ? true : isFetching}>
			{/* @ts-ignore */}
			<SectionList
				sections={sections}
				keyboardDismissMode="on-drag"
				keyExtractor={(item, index) => item.id + index.toString()}
				// @ts-ignore
				renderItem={({ section: { renderItem } }) => <View>{renderItem}</View>}
				renderSectionHeader={({ section: { title, data } }) =>
					data.length > 0 && (
						<Text variant="titleLarge" style={{ fontWeight: '900' }}>
							{title}
						</Text>
					)
				}
				contentContainerStyle={{ paddingBottom: 100 }}
				ListHeaderComponent={header}
			/>
		</LoadingView>
	);
};

const AnimeList = ({ query }: { query: string }) => {
	const { data, fetchNextPage } = useSearchAnime(query);

	const flattenData = data?.pages ? data?.pages?.flatMap((page) => [...page.anime]) : [];

	const renderAnime = ({ item }: { item: SearchAnimeResponse['anime'][0] }) => {
		return (
			<SearchItem
				title={item.name}
				details={`${item.media_format} ・ ${item.season} ${item.year}`}
				type="Anime"
				imageUrl={item.images[0]?.link}
				onPress={() =>
					router.navigate({
						pathname: '/(tabs)/search/anime/[slug]',
						params: { slug: item.slug },
					})
				}
			/>
		);
	};

	const oneEndReached = async () => {
		const latestIndex = data ? data?.pages.length - 1 : null;
		if (data && latestIndex !== null && data?.pages[latestIndex].meta.total) {
			if (flattenData.length < data.pages[latestIndex].meta.total) {
				await fetchNextPage();
			}
		} else if (data && latestIndex !== null) {
			await fetchNextPage();
		}
	};

	return (
		<FlatList
			data={flattenData}
			renderItem={renderAnime}
			keyExtractor={(item, idx) => item.id.toString()}
			onEndReached={oneEndReached}
			keyboardDismissMode="on-drag"
			contentContainerStyle={{ paddingBottom: 100 }}
		/>
	);
};

const ThemeList = ({
	query,
	onTrackSelect,
}: {
	query: string;
	onTrackSelect: (track: CustomTrack) => void;
}) => {
	const { data, fetchNextPage } = useSearchThemes(query);

	const flattenData = data?.pages ? data?.pages?.flatMap((page) => [...page.animethemes]) : [];

	const renderTheme = ({ item }: { item: SearchThemesResponse['animethemes'][0] }) => {
		return (
			<SearchItem
				title={item.song.title}
				type={item.slug}
				onPress={async () => {
					if (item.track) {
						await TrackPlayer.load(item.track);
						TrackPlayer.play();
					}
				}}
				onLongPress={() => item.track && onTrackSelect(item.track)}
				details={`by ${item.song.artists?.map((artist) => artist.name).join(', ')}`}
				imageUrl={item.anime.images[0]?.link}
			/>
		);
	};

	const oneEndReached = async () => {
		const latestIndex = data ? data?.pages.length - 1 : null;
		if (data && latestIndex !== null && data?.pages[latestIndex].meta.total) {
			if (flattenData.length < data.pages[latestIndex].meta.total) {
				await fetchNextPage();
			}
		} else if (data && latestIndex !== null) {
			await fetchNextPage();
		}
	};

	return (
		<FlatList
			data={flattenData}
			renderItem={renderTheme}
			keyExtractor={(item, idx) => item.id.toString()}
			onEndReached={oneEndReached}
			keyboardDismissMode="on-drag"
			contentContainerStyle={{ paddingBottom: 100 }}
		/>
	);
};

const ArtistsList = ({ query }: { query: string }) => {
	const { data, fetchNextPage } = useSearchArtists(query);

	const flattenData = data?.pages ? data?.pages?.flatMap((page) => [...page.artists]) : [];

	const renderTheme = ({ item }: { item: SearchArtistsResponse['artists'][0] }) => {
		return (
			<SearchItem
				title={item.name}
				type={item.slug}
				onPress={() =>
					router.navigate({
						pathname: '/(tabs)/search/artist/[artistSlug]',
						params: { artistSlug: item.slug },
					})
				}
				onLongPress={() => null}
				imageUrl={item.images[0]?.link}
			/>
		);
	};

	const oneEndReached = async () => {
		const latestIndex = data ? data?.pages.length - 1 : null;
		if (data && latestIndex !== null && data?.pages[latestIndex].meta.total) {
			if (flattenData.length < data.pages[latestIndex].meta.total) {
				await fetchNextPage();
			}
		} else if (data && latestIndex !== null) {
			await fetchNextPage();
		}
	};

	return (
		<FlatList
			data={flattenData}
			renderItem={renderTheme}
			keyExtractor={(item, idx) => item.id.toString()}
			onEndReached={oneEndReached}
			keyboardDismissMode="on-drag"
			contentContainerStyle={{ paddingBottom: 100 }}
		/>
	);
};

const SearchPage = () => {
	const songBtmSheetRef = useRef<BottomSheetModal>(null);
	const playlistAddSheetRef = useRef<BottomSheetModal>(null);
	const { top } = useSafeAreaInsets();
	const [query, setQuery] = useState<string>('');
	const debouncedSearch = useDebounce(query, 600);
	const { data, isFetching } = useSearchAll(debouncedSearch);

	const [catSelected, setCatSelected] = useState<Categories>('all');
	const [selectedTrack, setSelectedTrack] = useState<CustomTrack>();

	const onTrackSelect = (track: CustomTrack) => {
		setSelectedTrack(track);
		songBtmSheetRef.current?.present();
	};

	return (
		<StackView style={{ paddingTop: top + 20, paddingHorizontal: 10 }}>
			<Searchbar mode="bar" value={query} onChangeText={setQuery} />
			<SegmentedButtons
				buttons={buttons}
				value={catSelected}
				onValueChange={(val) => setCatSelected(val as Categories)}
				style={{ marginVertical: 12 }}
			/>
			{catSelected === 'all' && (
				<AllList
					data={query.length > 0 ? data : undefined}
					isFetching={isFetching}
					onTrackSelect={onTrackSelect}
				/>
			)}
			{catSelected === 'anime' && <AnimeList query={debouncedSearch} />}
			{catSelected === 'animetheme' && (
				<ThemeList query={debouncedSearch} onTrackSelect={onTrackSelect} />
			)}
			{catSelected === 'artist' && <ArtistsList query={debouncedSearch} />}
			<SongBottomSheet
				ref={songBtmSheetRef}
				track={selectedTrack}
				onPlaylistAdd={() => playlistAddSheetRef.current?.present()}
			/>
			<PlaylistsAddBottomSheet ref={playlistAddSheetRef} track={selectedTrack} />
		</StackView>
	);
};

export default SearchPage;
