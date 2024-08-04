import AnimePage from '@/src/components/sharedScreens/anime';
import AnimeThemePage from '@/src/components/sharedScreens/animetheme';
import { useLocalSearchParams } from 'expo-router';

const AnimeControlPage = () => {
	const { slug, animeId, themeId } = useLocalSearchParams<{
		slug: string; // anime slug
		animeId?: string;
		themeId?: string;
	}>();

	return animeId && themeId ? (
		<AnimeThemePage animeId={parseInt(animeId)} themeId={parseInt(themeId)} />
	) : (
		<AnimePage slug={slug} />
	);
};

export default AnimeControlPage;
