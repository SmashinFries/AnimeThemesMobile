import { PaperHeader } from '@/src/components/headers';
import { Stack } from 'expo-router';

const PlaylistsLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerShown: true,
				animation: 'fade',
				header: (props) => <PaperHeader {...props} />,
			}}>
			<Stack.Screen name="index" options={{ title: 'Playlists' }} />
			<Stack.Screen name="[id]" options={{ headerShown: false }} />
		</Stack>
	);
};

export default PlaylistsLayout;
