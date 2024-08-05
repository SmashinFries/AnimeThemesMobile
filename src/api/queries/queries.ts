import { ANIME_THEMES_URL } from '@/src/constants';
import axios from 'axios';
import {
	AnimeResponse,
	AnimeThemeResponse,
	Artist,
	ArtistResponse,
	ArtistsResponse,
	ExploreDataParams,
	ExploreDataResponse,
	SearchAllResponse,
	SearchAnimeResponse,
	SearchAnimeSort,
	SearchArtistsResponse,
	SearchArtistsSort,
	SearchThemesResponse,
	SearchThemesSort,
} from './types';
import { animeThemeToTrack, exploreDataToTrack, searchAllToTrack } from '@/src/utils/formatTrack';
import { getSeason } from '@/src/utils/date';

// AnimeThemes API client
const ATClient = axios.create({ baseURL: ANIME_THEMES_URL });

export const fetchRecentlyAdded = async (page_num: number = 1) => {
	const params: ExploreDataParams = {
		sort: '-created_at',
		include:
			'animethemeentries.animetheme.anime.images,audio,animethemeentries.animetheme.song.artists',
		'fields[video]': 'id,basename,link,path',
		'fields[animetheme]': 'id,type,slug',
		'fields[anime]': 'id,name,slug,media_format,season,year',
		'page[number]': page_num,
		'page[size]': 30,
	};
	const { data } = await ATClient.get<ExploreDataResponse>('/video', { params });
	const tracks = exploreDataToTrack(data);
	return tracks;
};

export const fetchMostViewed = async (page_num: number = 1) => {
	const params: ExploreDataParams = {
		sort: '-views_count',
		include:
			'animethemeentries.animetheme.anime.images,audio,animethemeentries.animetheme.song.artists',
		'fields[video]': 'id,basename,link,path',
		'fields[animetheme]': 'id,type,slug',
		'fields[anime]': 'id,name,slug,media_format,season,year',
		'page[number]': page_num,
		'page[size]': 30,
	};
	const { data } = await ATClient.get<ExploreDataResponse>('/video', { params });
	const tracks = exploreDataToTrack(data);
	return tracks;
};

export const fetchThisSeason = async () => {
	const season = getSeason();
	const params = {
		sort: '-updated_at',
		'filter[season-eq]': season.current_season,
		'filter[year-eq]': season.year,
	};
	const { data } = await ATClient.get('https://api.animethemes.moe/anime/', { params });
	return data;
};

export const fetchRandom = async (pageSize: number = 1) => {
	const params: ExploreDataParams = {
		sort: 'random',
		include:
			'animethemeentries.animetheme.anime.images,audio,animethemeentries.animetheme.song.artists',
		'fields[video]': 'id,basename,link,path',
		'fields[animetheme]': 'id,type,slug',
		'fields[anime]': 'id,name,slug,media_format,season,year',
		'page[number]': 1,
		'page[size]': pageSize,
	};
	const { data } = await ATClient.get<ExploreDataResponse>('/video', { params });
	const tracks = exploreDataToTrack(data);
	return tracks;
};

export const fetchAnime = async (slug: string) => {
	const params = {
		include:
			'animesynonyms,images,resources,studios,animethemes.animethemeentries.videos.audio,animethemes.song.artists',
	};
	const { data } = await ATClient.get<AnimeResponse>('/anime/' + slug, { params });
	return data;
};

export const fetchAnimeTheme = async (animeId: number, themeId: number) => {
	const params = {
		include: 'anime.images,song.artists,animethemeentries.videos.audio',
		'filter[anime][id]': animeId,
	};
	const { data } = await ATClient.get<AnimeThemeResponse>('/animetheme/' + themeId.toString(), {
		params,
	});
	return data;
};

export const fetchArtists = async (artists: Artist[]) => {
	const params = {
		'filter[slug]': artists?.map((artist) => artist.slug).join(','),
		include: 'images,members',
	};
	const { data } = await ATClient.get<ArtistsResponse>('/artist/', { params });
	return data;
};

export const fetchArtist = async (slug: string) => {
	const params = {
		include:
			'resources,images,members,songs.artists,songs.animethemes.anime.images,songs.animethemes.animethemeentries.videos.audio',
		'fields[artist]': 'id,name,slug,created_at,updated_at',
		'fields[song]': 'id,title,created_at,updated_at',
	};
	const { data } = await ATClient.get<ArtistResponse>('/artist/' + slug, { params });
	return data;
};

export const fetchSearchAll = async (q: string) => {
	const params = {
		q: q,
		'include[anime]': 'images',
		'fields[search]': 'anime,animethemes,artists',
		'include[artist]': 'images',
		'include[animetheme]': 'animethemeentries.videos.audio,anime.images,song.artists',
		'page[limit]': 3,
	};
	const { data } = await ATClient.get<SearchAllResponse>('/search', { params });
	const tracks = searchAllToTrack(data);
	return tracks;
};

export const fetchSearchAnime = async (q?: string, sort?: SearchAnimeSort, page: number = 1) => {
	const params = {
		q: q && q.length > 0 ? q : undefined,
		include: 'images',
		sort: sort,
		'page[size]': 30,
		'page[number]': page,
	};
	const { data } = await ATClient.get<SearchAnimeResponse>('/anime/', { params });
	return data;
};

export const fetchSearchThemes = async (q?: string, sort?: SearchThemesSort, page: number = 1) => {
	const params = {
		q: q && q.length > 0 ? q : undefined,
		include: 'anime.images,song.artists,animethemeentries.videos.audio',
		sort: sort,
		'page[size]': 30,
		'page[number]': page,
	};
	const { data } = await ATClient.get<SearchThemesResponse>('/animetheme/', { params });
	const tracks = animeThemeToTrack(data);
	return tracks;
};

export const fetchSearchArtists = async (
	q?: string,
	sort?: SearchArtistsSort,
	page: number = 1,
) => {
	const params = {
		q: q && q.length > 0 ? q : undefined,
		include: 'images',
		sort: sort,
		'page[size]': 30,
		'page[number]': page,
	};
	const { data } = await ATClient.get<SearchArtistsResponse>('/artist/', { params });
	return data;
};
