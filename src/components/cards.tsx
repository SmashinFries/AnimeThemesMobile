import { Pressable, SectionListRenderItemInfo, View } from 'react-native';
import { Image } from 'expo-image';
import { Icon, IconButton, Surface, Text, useTheme } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import { AnimeResponse, AnimeThemeEntry } from '../api/queries/types';
import { CustomTrack } from '../types';
import { sendCompletionToast } from '../utils/toasts';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { BLURHASH } from '../constants';

type SongCardProps = {
	track: CustomTrack;
	videoBasename: string;
	onPress?: () => void;
	onLongPress?: () => void;
};
export const SongBoxCard = ({ track, videoBasename, onPress, onLongPress }: SongCardProps) => {
	const { colors } = useTheme();

	return (
		<Animated.View entering={SlideInRight}>
			<Pressable
				onPress={onPress}
				onLongPress={onLongPress}
				android_ripple={{ borderless: false, foreground: true }}
				style={{
					flex: 1,
					borderRadius: 8,
					marginHorizontal: 5,
					padding: 10,
					maxWidth: 170,
				}}>
				<Image
					source={{ uri: track.artwork }}
					style={{
						aspectRatio: 1 / 1,
						borderRadius: 8,
						width: undefined,
						height: 160,
						alignSelf: 'center',
					}}
					contentFit="cover"
				/>
				<View
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						margin: 0,
						flexDirection: 'row',
						width: '100%',
					}}>
					<View
						style={{
							backgroundColor: colors.primaryContainer,
							borderTopLeftRadius: 8,
							borderTopRightRadius: track.version ? 0 : 8,
							borderBottomLeftRadius: 8,
							borderBottomRightRadius: track.version ? 0 : 8,
							paddingHorizontal: 4,
							paddingVertical: 2,
						}}>
						<Text
							variant="labelSmall"
							style={{ fontWeight: '900', color: colors.onPrimaryContainer }}>
							{track.animetheme?.slug}
						</Text>
					</View>
					{track.version && (
						<View
							style={{
								backgroundColor: colors.secondaryContainer,
								borderBottomRightRadius: 8,
								borderTopRightRadius: 8,
								paddingHorizontal: 4,
								paddingVertical: 2,
							}}>
							<Text
								variant="labelSmall"
								style={{ fontWeight: '900', color: colors.onSecondaryContainer }}>
								v{track.version}
							</Text>
						</View>
					)}
				</View>
				<Text numberOfLines={2}>{track.title}</Text>
				<Text
					variant="labelMedium"
					numberOfLines={1}
					style={{ color: colors.onSurfaceVariant }}>
					{track.artist}
				</Text>
			</Pressable>
		</Animated.View>
	);
};

export const VersionListing = ({
	themeEntry,
	song,
	track,
}: {
	themeEntry: AnimeThemeEntry;
	track: CustomTrack;
	song: AnimeResponse['anime']['animethemes'][0]['song'];
}) => {
	const { colors } = useTheme();

	const finalTrack: CustomTrack = {
		...track,
		url: themeEntry.videos[0]?.audio?.link,
		title: song.title,
		videoUrl: themeEntry.videos[0]?.link,
	};

	const playSong = async () => {
		await TrackPlayer.reset();
		TrackPlayer.add([finalTrack]);
		TrackPlayer.play();
	};

	const addToQueue = async () => {
		await TrackPlayer.add([finalTrack]);
		await sendCompletionToast('Added to queue!');
	};

	return (
		// style={{ backgroundColor: colors.surfaceVariant }}
		<View style={{ marginVertical: 6 }}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					paddingHorizontal: 16,
				}}>
				<View
					style={{
						justifyContent: 'center',
						flexDirection: 'row',
						alignItems: 'center',
					}}>
					<Text style={{ color: colors.onSurfaceVariant, fontWeight: '900' }}>
						{themeEntry.version ? `v${themeEntry.version}` : 'v1'}
					</Text>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							paddingHorizontal: 10,
						}}>
						<Icon source={'file-video-outline'} size={16} />
						<Text style={{ paddingHorizontal: 8 }}>{themeEntry.episodes}</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'flex-start',
						borderRadius: 100,
					}}>
					<IconButton icon="playlist-plus" onPress={addToQueue} />
					<IconButton
						icon="play"
						mode="contained"
						style={{ margin: 0 }}
						onPress={playSong}
					/>
				</View>
			</View>
		</View>
	);
};

export const ThemeListing = ({
	item,
	track,
}: { track: CustomTrack } & SectionListRenderItemInfo<
	AnimeResponse['anime']['animethemes'][0],
	{
		title: string;
		data: AnimeResponse['anime']['animethemes'];
	}
>) => {
	const { colors } = useTheme();

	const newTrack: CustomTrack = { ...track, animetheme: { slug: item.slug, type: item.type } };

	return (
		<Surface
			mode="elevated"
			style={{
				padding: 8,
				borderRadius: 8,
				marginVertical: 6,
				width: '95%',
				alignSelf: 'center',
			}}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ justifyContent: 'center', paddingHorizontal: 10 }}>
						<Text style={{ fontWeight: '900' }}>{item.slug}</Text>
					</View>
					{/* <DividerVertical style={{ marginHorizontal: 10 }} /> */}
					<View>
						<Text variant="labelLarge">{item.song.title}</Text>
						<Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>
							{item.song.artists?.map((artist) => artist.name).join(', ')}
						</Text>
					</View>
				</View>
				{/* <View>
					<IconButton icon="dots-horizontal" />
				</View> */}
			</View>
			<View style={{ marginTop: 5 }}>
				{item.animethemeentries.map((themeEntry, idx) => (
					<VersionListing
						key={idx}
						themeEntry={themeEntry}
						song={item.song}
						track={newTrack}
					/>
				))}
			</View>
		</Surface>
	);
};

type SearchItemProps = {
	title: string;
	type: string;
	onPress: () => void;
	onLongPress?: () => void;
	imageUrl?: string;
	details?: string;
};
export const SearchItem = ({
	title,
	type,
	details,
	imageUrl,
	onPress,
	onLongPress,
}: SearchItemProps) => {
	const { colors } = useTheme();

	return (
		<Surface
			style={{ padding: 5, borderRadius: 8, justifyContent: 'center', marginVertical: 6 }}>
			<Pressable onPress={onPress} onLongPress={onLongPress}>
				<View style={{ flexDirection: 'row' }}>
					<Image
						source={{ uri: imageUrl }}
						style={{
							aspectRatio: 1 / 1,
							width: undefined,
							height: 80,
							borderRadius: 12,
						}}
						placeholder={{ blurhash: BLURHASH }}
						contentFit="cover"
					/>
					<View style={{ flex: 1, paddingHorizontal: 10, justifyContent: 'center' }}>
						<Text variant="titleMedium" numberOfLines={2} style={{ fontWeight: '900' }}>
							{title}
						</Text>
						<Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>
							{type}
							{details ? ` ・ ${details}` : ''}
						</Text>
					</View>
					<IconButton
						icon={'dots-vertical'}
						style={{ alignSelf: 'center' }}
						onPress={onLongPress}
					/>
				</View>
			</Pressable>
		</Surface>
	);
};
