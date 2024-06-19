import { ANIME_THEMES_URL } from '@/src/constants';
import axios from 'axios';
import { ExploreDataParams, ExploreDataResponse } from './types';

// AnimeThemes API client
const ATClient = axios.create({ baseURL: ANIME_THEMES_URL });

export const fetchRecentlyAdded = async (page_num: number = 1) => {
	const params: ExploreDataParams = {
		sort: '-created_at',
		include:
			'animethemeentries.animetheme.anime.images,audio,animethemeentries.animetheme.song.artists',
		'fields[video]': 'id,link,path',
		'fields[animetheme]': 'id',
		'fields[anime]': 'id,name,slug',
		'page[number]': page_num,
		'page[size]': 15,
	};
	const { data } = await ATClient.get<ExploreDataResponse>('/video', { params });
	return data;
};

export const fetchMostViewed = async (page_num: number = 1) => {
	const params: ExploreDataParams = {
		sort: '-views_count',
		include:
			'animethemeentries.animetheme.anime.images,audio,animethemeentries.animetheme.song.artists',
		'fields[video]': 'id,link,path',
		'fields[animetheme]': 'id',
		'fields[anime]': 'id,name,slug',
		'page[number]': page_num,
		'page[size]': 15,
	};
	const { data } = await ATClient.get<ExploreDataResponse>('/video', { params });
	return data;
};

export const fetchRandom = async () => {
	const params: ExploreDataParams = {
		sort: 'random',
		include:
			'animethemeentries.animetheme.anime.images,audio,animethemeentries.animetheme.song.artists',
		'fields[video]': 'id,link,path',
		'fields[animetheme]': 'id',
		'fields[anime]': 'id,name,slug',
		'page[number]': 1,
		'page[size]': 1,
	};
	const { data } = await ATClient.get<ExploreDataResponse>('/video', { params });
	return data;
};
