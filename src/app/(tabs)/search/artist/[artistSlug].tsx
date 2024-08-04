import ArtistPage from '@/src/components/sharedScreens/artist';
import { useLocalSearchParams } from 'expo-router';

const ArtistControllerPage = () => {
	const { artistSlug } = useLocalSearchParams<{ artistSlug: string }>();
	return <ArtistPage slug={artistSlug} />;
};

export default ArtistControllerPage;
