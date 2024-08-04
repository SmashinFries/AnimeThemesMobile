import { usePlaylistStore } from '@/src/store/playlists';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, HelperText, IconButton, Text, TextInput } from 'react-native-paper';
import { getPlaylistImage } from '../utils/upload';
import { router } from 'expo-router';
import { BLURHASH } from '../constants';

const CreatePlaylistPage = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [imgSrc, setImgSrc] = useState('');
	const { playlists, createPlaylist } = usePlaylistStore();
	const [isTitleError, setIsTitleError] = useState(false);

	const uploadImage = async () => {
		const loc = await getPlaylistImage();
		if (loc) {
			setImgSrc(loc);
		}
	};

	const onCreate = () => {
		if (playlists.findIndex((val) => val.title === title) === -1) {
			createPlaylist(title, description, imgSrc, undefined);
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
