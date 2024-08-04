import { usePlaylistStore } from '@/src/store/playlists';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, HelperText, IconButton, Surface, Text, TextInput } from 'react-native-paper';
import { getPlaylistImage } from '../utils/upload';
import { router, useLocalSearchParams } from 'expo-router';
import { BLURHASH } from '../constants';
import { CustomTrack } from '../types';
import { SearchItem } from '../components/cards';
import Animated, { FadeOut, SlideOutLeft } from 'react-native-reanimated';

const CreatePlaylistPage = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [imgSrc, setImgSrc] = useState('');
	const { playlists, createPlaylist } = usePlaylistStore();
	const [isTitleError, setIsTitleError] = useState(false);
	const { track } = useLocalSearchParams<{ track: string }>();
	const [shouldAddTrack, setShouldAddTrack] = useState(true);

	const customTrack: CustomTrack | null = track ? (JSON.parse(track) as CustomTrack) : null;

	const uploadImage = async () => {
		const loc = await getPlaylistImage();
		if (loc) {
			setImgSrc(loc);
		}
	};

	const onCreate = () => {
		if (playlists.findIndex((val) => val.title === title) === -1) {
			createPlaylist(
				title,
				description,
				imgSrc,
				customTrack && shouldAddTrack ? [customTrack] : undefined,
			);
			router.back();
		}
	};

	return (
		<ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
			<View style={{ alignItems: 'center', paddingVertical: 10 }}>
				<Pressable style={{ justifyContent: 'center' }} onPress={uploadImage}>
					<Image
						placeholder={{ blurhash: BLURHASH }}
						source={{ uri: imgSrc }}
						style={{ height: 200, aspectRatio: 1 / 1 }}
					/>
					{!imgSrc && (
						<IconButton
							icon="pencil"
							size={38}
							style={{ position: 'absolute', alignSelf: 'center' }}
						/>
					)}
				</Pressable>
			</View>
			<View style={{ paddingVertical: 12 }}>
				<TextInput
					mode="outlined"
					label={'Title'}
					value={title}
					onChangeText={(txt) => {
						setTitle(txt);
						if (
							playlists.findIndex(
								(val) =>
									val.title.trim().toLowerCase() === txt.trim().toLowerCase(),
							) > -1
						) {
							setIsTitleError(true);
						} else {
							setIsTitleError(false);
						}
					}}
				/>
				<HelperText type="error" visible={isTitleError}>
					Playlist name already exists!
				</HelperText>
				<TextInput
					mode="outlined"
					label={'Description'}
					value={description}
					onChangeText={(txt) => setDescription(txt)}
					multiline
					style={{ marginVertical: 10 }}
				/>
				{customTrack && shouldAddTrack ? (
					<Animated.View exiting={SlideOutLeft} style={{ marginVertical: 12 }}>
						<Text variant="titleLarge">Adding theme:</Text>
						<SearchItem
							title={customTrack.title ?? ''}
							type={customTrack.artist ?? ''}
							onPress={() => null}
							imageUrl={customTrack.artwork}
							icon="close"
							onLongPress={() => setShouldAddTrack(false)}
						/>
					</Animated.View>
				) : null}
				<Button
					mode="contained"
					disabled={isTitleError}
					style={{ marginVertical: 12 }}
					onPress={onCreate}>
					Create
				</Button>
			</View>
		</ScrollView>
	);
};

export default CreatePlaylistPage;
