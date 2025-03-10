import { useAnime } from '@/src/api/queries/hooks';
import { AnimeResponse, AnimeTheme } from '@/src/api/queries/types';
import { VideoBackground } from '@/src/components/background';
import { AnimHeader } from '@/src/components/headers';
import { useHeaderAnim } from '@/src/hooks/useHeaderFade';
import { copyToClipboard } from '@/src/utils/text';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { useCallback, useMemo, useRef } from 'react';
import {
	DefaultSectionT,
	Linking,
	ScrollView,
	SectionList,
	SectionListRenderItemInfo,
	View,
} from 'react-native';
import { ActivityIndicator, Chip, Text } from 'react-native-paper';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TitleDetail } from '../text';
import { ThemeListing } from '../cards';
import { CustomTrack } from '@/src/types';
import { StackView } from '../view';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList<any, DefaultSectionT>);

type AnimeHeaderProps = {
	data: AnimeResponse;
};
const AnimeHeading = ({ data }: AnimeHeaderProps) => {
	return (
		<View>
			<VideoBackground
				source={data.anime.animethemes[0]?.animethemeentries[0]?.videos[0]?.link}
			/>
			<SafeAreaView style={{ paddingTop: 75 }}>
				<View style={{ paddingHorizontal: 20 }}>
					<View
						style={{
							width: '100%',
							flexDirection: 'row',
							justifyContent: 'flex-start',
							// paddingHorizontal: 20,
							alignItems: 'center',
						}}>
						<Image
							source={{ uri: data.anime.images[0].link }}
							style={{
								aspectRatio: 2 / 3,
								width: undefined,
								height: 150,
								borderRadius: 6,
								backgroundColor: 'red',
							}}
							contentFit="cover"
						/>
						<View style={{ flex: 1, paddingHorizontal: 10 }}>
							<Text
								variant="titleLarge"
								onLongPress={() => copyToClipboard(data.anime.name)}>
								{data.anime.name}
							</Text>
							<TitleDetail
								text={data.anime.studios?.map((studio) => studio.name).join(', ')}
								icon="account-multiple-outline"
							/>
							<TitleDetail
								text={`${data.anime.season} ${data.anime.year}`}
								icon="calendar"
							/>

							<TitleDetail text={data.anime.media_format} icon="video-outline" />
						</View>
					</View>
					{!!data.anime.synopsis && (
						<Text style={{ paddingVertical: 16 }}>
							{data.anime.synopsis.replace(/<[^>]*>?/gm, '')}
						</Text>
					)}
					<Text selectable style={{ paddingVertical: 16 }}>
						Alternative Titles:{'\n'}
						{data.anime.animesynonyms.map((syn) => syn.text).join(', ')}
					</Text>
				</View>
				<ScrollView
					horizontal
					contentContainerStyle={{ paddingHorizontal: 20, marginVertical: 16 }}
					showsHorizontalScrollIndicator={false}>
					{data.anime.resources?.map((resource, idx) => (
						<Chip
							key={idx}
							mode="outlined"
							// icon={'link'}
							compact
							onPress={async () => {
								Linking.openURL(resource.link);
							}}
							style={{ marginRight: 10 }}>
							{resource.site}
						</Chip>
					))}
				</ScrollView>
				<View style={{ paddingHorizontal: 20 }}>
					<Text variant="titleMedium">{data.anime.animethemes?.length} Themes</Text>
				</View>
			</SafeAreaView>
		</View>
	);
};

const AnimePage = ({ slug }: { slug: string | undefined }) => {
	const headerAnim = useHeaderAnim();
	const listRef = useRef<SectionList>(null);
	const { data, isFetching } = useAnime(slug);

	const themes = useMemo(() => {
		return [
			{
				title: 'OP',
				data: data?.anime.animethemes?.filter((theme) => theme.type === 'OP') ?? [],
			},
			{
				title: 'ED',
				data: data?.anime.animethemes?.filter((theme) => theme.type === 'ED') ?? [],
			},
		];
	}, [data]);

	const renderItem = useCallback(
		(
			props: SectionListRenderItemInfo<
				AnimeTheme,
				{
					title: string;
					data: AnimeTheme[];
				}
			>,
		) => {
			const track: CustomTrack = {
				url: '',
				artwork: data?.anime.images[1].link ?? '',
				anime: {
					id: data?.anime.id ?? 0,
					slug: data?.anime.slug ?? '',
					name: data?.anime.name ?? '',
					media_format: data?.anime.media_format ?? '',
					year: data?.anime.year ?? 0,
					season: data?.anime.season ?? '',
				},
			};
			// @ts-ignore
			return <ThemeListing {...props} track={track} />;
		},
		[data],
	);

	return (
		<StackView>
			<Stack.Screen
				options={{
					title: data?.anime.name,
					headerShown: true,
					headerTransparent: true,
					header: (props) => (
						<AnimHeader
							{...props}
							{...headerAnim}
							shareLink={'https://animethemes.moe/anime/' + data?.anime.slug}
						/>
					),
				}}
			/>
			{isFetching && (
				<Animated.View
					entering={FadeIn}
					exiting={FadeOut}
					style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
					<ActivityIndicator size={'large'} />
				</Animated.View>
			)}
			{!isFetching && data && (
				<Animated.View entering={FadeIn}>
					{/* {data && <AnimeHeader data={data} />} */}
					<AnimatedSectionList
						ref={listRef}
						sections={themes}
						// @ts-ignore
						renderItem={renderItem}
						keyExtractor={(_, idx) => idx.toString()}
						ListHeaderComponent={() => <AnimeHeading data={data} />}
						contentContainerStyle={{ paddingBottom: 100 }}
						onScroll={headerAnim.scrollHandler}
						renderSectionHeader={(props) =>
							props.section.data.length > 0 ? (
								<View style={{ paddingHorizontal: 20, marginVertical: 8 }}>
									<Text variant="titleSmall">{props.section.title}</Text>
								</View>
							) : null
						}
					/>
					{/* <Button onPress={() => console.log(themes)}>PRINT PARAMS</Button> */}
				</Animated.View>
			)}
		</StackView>
	);
};

export default AnimePage;
