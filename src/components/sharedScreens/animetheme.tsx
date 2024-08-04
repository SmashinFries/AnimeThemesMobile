import { useAnimeTheme, useArtists } from '@/src/api/queries/hooks';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Button, IconButton, List, Surface, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrackPlayer, { State, useActiveTrack, usePlaybackState } from 'react-native-track-player';
import { PaperHeader } from '../headers';
import { VideoBackground } from '../background';
import { useMemo } from 'react';
import { CustomTrack } from '@/src/types';

type AnimeThemePageProps = {
	animeId: number;
	themeId: number;
};
const AnimeThemePage = ({ animeId, themeId }: AnimeThemePageProps) => {
	const animetheme = useAnimeTheme(animeId, themeId);
	// const artists = useArtists(video.data?.video?.animethemeentries[0]?.animetheme?.song?.artists);
	const { state } = usePlaybackState();
	const activeTrack = useActiveTrack() as CustomTrack | undefined;

	const tracks: CustomTrack[] | undefined = useMemo(
		() =>
			animetheme.data?.animetheme.animethemeentries.map(
				(entry) =>
					({
						url: entry.videos[entry.videos.length - 1].audio.link, // default to best quality
						anime: {
							id: animetheme.data.animetheme.anime.id,
							media_format: animetheme.data.animetheme.anime.media_format,
							name: animetheme.data.animetheme.anime.name,
							season: animetheme.data.animetheme.anime.season,
							year: animetheme.data.animetheme.anime.year,
							slug: animetheme.data.animetheme.anime.slug,
						},
						artistData: animetheme.data.animetheme.song.artists,
						artist: animetheme.data.animetheme.song.artists
							.map((artist) => artist.name)
							.join(', '),
						artwork: animetheme.data.animetheme.anime.images[1].link,
						videosData: entry.videos,
					}) as CustomTrack,
			),
		[animetheme],
	);

	return (
		<SafeAreaView style={{ paddingTop: 75 }}>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTransparent: true,
					header: (props) => <PaperHeader {...props} />,
					title: animetheme.data?.animetheme.song.title
						? `${animetheme.data?.animetheme.slug} - ${animetheme.data?.animetheme.song.title}`
						: '',
				}}
			/>
			<View>
				{animetheme.data?.animetheme.animethemeentries.map((entry, idx) => (
					<View>
						<List.Subheader>
							{entry.version ? `v${entry.version}` : 'v1'}
						</List.Subheader>
					</View>
				))}
			</View>
			{/* {video.data?.video.link && <VideoBackground source={video.data.video.link} />} */}
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
				<IconButton
					icon={state === State.Playing ? 'pause' : 'play'}
					onPress={() =>
						state === State.Playing ? TrackPlayer.pause() : TrackPlayer.play()
					}
				/>
			</View>
			<Text>Currently playing: {activeTrack ? activeTrack.title : 'None!'}</Text>
			<Text>State: {state}</Text>
			<Text>Names: {tracks?.map((track) => track.title).join(', ')}</Text>
			{/* <Button onPress={() => console.log(track)}>Print Track</Button>
			<Button onPress={() => track && TrackPlayer.add([track])}>Add to player</Button> */}
			<Button onPress={() => TrackPlayer.remove([0])}>Remove from player</Button>
		</SafeAreaView>
	);
};

export default AnimeThemePage;
