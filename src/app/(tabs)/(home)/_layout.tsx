import { Stack } from 'expo-router';

const HomeLayout = () => {
	return (
		<Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
			<Stack.Screen name="index" />
			<Stack.Screen name="artist/[artistSlug]" />
			<Stack.Screen name="anime/[slug]" />
		</Stack>
	);
};

export default HomeLayout;
