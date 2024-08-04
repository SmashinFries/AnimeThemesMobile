import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const IMG_DIR = `${FileSystem.documentDirectory}/images/`;

export const getPlaylistImage = async () => {
	let result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.All,
		allowsEditing: true,
		aspect: [1, 1],
		quality: 1,
		allowsMultipleSelection: false,
	});

	const imgDirInfo = await FileSystem.getInfoAsync(IMG_DIR);

	if (!imgDirInfo.exists) {
		await FileSystem.makeDirectoryAsync(IMG_DIR);
	}

	if (!result.canceled) {
		const file_loc = IMG_DIR + result.assets[0].uri.split('/').at(-1);
		console.log(file_loc);
		await FileSystem.copyAsync({
			from: result.assets[0].uri,
			to: file_loc,
		});
		return file_loc;
	} else {
		return null;
	}
};
