import { Track } from 'react-native-track-player';
import { AnimeThemeVideo, Artist } from './api/queries/types';
import { Endpoints } from '@octokit/types';

export type CustomTrack = Track & {
	anime?: {
		id: number;
		slug: string;
		name: string;
		season: string;
		year: number;
		media_format: string;
		// resources: AnimeResource[];
	};
	artistsData?: Artist[];
	videoUrl?: string;
	episodes?: string;
	version?: number | null;
	animetheme?: {
		type: string;
		slug: string;
	};

	// videosData?: AnimeThemeVideo[];
};

export type GithubReleaseResponse =
	Endpoints['GET /repos/{owner}/{repo}/releases']['response']['data'];
