import { PlaylistsBottomSheet } from '@/src/components/bottomsheets';
import { PlaylistsHeader } from '@/src/components/headers';
import { StackView } from '@/src/components/view';
import { BLURHASH } from '@/src/constants';
import { Playlist, usePlaylistStore } from '@/src/store/playlists';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { List } from 'react-native-paper';

const PlaylistsPage = () => {
	const { playlists } = usePlaylistStore();
	const [selectedPL, setSelectedPL] = useState<Playlist>();
	const playlistSheetRef = useRef<BottomSheetModal>(null);

	const onSelected = (playlist: Playlist) => {
		setSelectedPL(playlist);
		playlistSheetRef.current?.present();
	};

	return (
		<StackView>
			<Stack.Screen
				options={{
					header: (props) => (
						<PlaylistsHeader {...props} onAddPlaylist={() => router.push('/create')} />
					),
				}}
			/>
			<ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
				{playlists.map(
					(pl, idx) => (
						<List.Item
							key={idx}
							title={pl.title}
							description={pl.description}
							left={(props) => (
								<Image
									source={{ uri: pl.coverImg ?? undefined }}
									placeholder={{ blurhash: BLURHASH }}
									style={[
										{ width: 56, height: 56, borderRadius: 12 },
										props.style,
									]}
								/>
								// <List.Image {...props} source={{ uri: pl.coverImg ?? undefined }} />
							)}
							right={(props) => (
								<Pressable {...props} onPress={() => onSelected(pl)}>
									<List.Icon color={props.color} icon={'dots-vertical'} />
								</Pressable>
							)}
							onPress={() =>
								router.push({
									pathname: '/(tabs)/playlists/[id]',
									params: { id: pl.id },
								})
							}
							onLongPress={() => onSelected(pl)}
						/>
					),
					[],
				)}
			</ScrollView>
			<PlaylistsBottomSheet ref={playlistSheetRef} playlist={selectedPL} />
		</StackView>
	);
};

export default PlaylistsPage;
