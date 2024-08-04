import {
	AnimeThemeResponse,
	ExploreDataResponse,
	ExploreDataTracks,
	SearchAllResponse,
	SearchThemesResponse,
} from '../api/queries/types';
import { CustomTrack } from '../types';

export const exploreDataToTrack = (data: ExploreDataResponse): ExploreDataTracks => {
	const tracks: CustomTrack[] = data.videos.map((vid) => ({
		url: vid.audio.link,
		title: vid.animethemeentries[0]?.animetheme?.song?.title,
		artist: vid.animethemeentries[0]?.animetheme?.song?.artists
			?.map((artist) => artist.name)
			?.join(', '),
		artwork: vid.animethemeentries[0]?.animetheme?.anime?.images?.find(
			(img) => img.facet === 'Large Cover',
		)?.link,
		artistsData: vid.animethemeentries[0]?.animetheme?.song?.artists,
		anime: {
			id: vid.animethemeentries[0]?.animetheme?.anime.id,
			media_format: vid.animethemeentries[0]?.animetheme?.anime.media_format,
			name: vid.animethemeentries[0]?.animetheme?.anime.name,
			season: vid.animethemeentries[0]?.animetheme?.anime.season,
			slug: vid.animethemeentries[0]?.animetheme?.anime.slug,
			year: vid.animethemeentries[0]?.animetheme?.anime.year,
		},
		videoUrl: vid.link,
		episodes: vid.animethemeentries[0]?.episodes,
		animetheme: {
			type: vid.animethemeentries[0]?.animetheme.type,
			slug: vid.animethemeentries[0]?.animetheme.slug,
		},
		version: vid.animethemeentries[0]?.version,
		// videosData: vid.animethemeentries,
	}));

	return { ...data, tracks };
};

export const animeThemeToTrack = (data: SearchThemesResponse): SearchThemesResponse => {
	const tracks: CustomTrack[] = data.animethemes.map((theme) => ({
		url: theme.animethemeentries[0].videos[0].audio.link,
		title: theme.song.title,
		artist: theme.song.artists?.map((artist) => artist.name)?.join(', '),
		artistsData: theme.song.artists,
		artwork: theme.anime.images?.find((img) => img.facet === 'Large Cover')?.link,
		anime: {
			id: theme.anime.id,
			media_format: theme.anime.media_format,
			name: theme.anime.name,
			season: theme.anime.season,
			year: theme.anime.year,
			slug: theme.anime.slug,
		},
		videoUrl: theme.animethemeentries[0].videos[0].link,
		episodes: theme.animethemeentries[0].episodes,
		version: theme.animethemeentries[0]?.version,
	}));

	const newData: SearchThemesResponse = { ...data };

	tracks.forEach((track, idx) => {
		newData.animethemes[idx]['track'] = track;
	});

	return newData;
};

export const searchAllToTrack = (data: SearchAllResponse): SearchAllResponse => {
	const tracks: CustomTrack[] = data.search.animethemes.map((theme) => ({
		url: theme.animethemeentries[0].videos[0].audio.link,
		title: theme.song.title,
		artist: theme.song.artists?.map((artist) => artist.name)?.join(', '),
		artistsData: theme.song.artists,
		artwork: theme.anime.images?.find((img) => img.facet === 'Large Cover')?.link,
		anime: {
			id: theme.anime.id,
			media_format: theme.anime.media_format,
			name: theme.anime.name,
			season: theme.anime.season,
			year: theme.anime.year,
			slug: theme.anime.slug,
		},
		videoUrl: theme.animethemeentries[0].videos[0].link,
		episodes: theme.animethemeentries[0].episodes,
		version: theme.animethemeentries[0]?.version,
	}));

	const newData: SearchAllResponse = { ...data };
	tracks.forEach((track, idx) => {
		newData.search.animethemes[idx]['track'] = track;
	});

	return newData;
};
