import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
	fetchAnime,
	fetchArtists,
	fetchMostViewed,
	fetchRecentlyAdded,
	fetchAnimeTheme,
	fetchArtist,
	fetchSearchAll,
	fetchSearchAnime,
	fetchSearchThemes,
	fetchSearchArtists,
	fetchRandom,
} from './queries';
import { Artist, SearchAnimeSort, SearchArtistsSort, SearchThemesSort } from './types';

export const useDiscover = (enabled = true) =>
	useQuery({
		queryKey: ['discover'],
		queryFn: () => fetchRandom(30),
		enabled: enabled,
		refetchOnWindowFocus: false,
	});

export const useRecentlyAdded = (enabled = true) =>
	useQuery({
		queryKey: ['recently_added'],
		queryFn: () => fetchRecentlyAdded(),
		enabled: enabled,
		refetchOnWindowFocus: false,
	});

export const useMostViewed = (enabled = true) =>
	useQuery({
		queryKey: ['most_viewed'],
		queryFn: () => fetchMostViewed(),
		enabled: enabled,
		refetchOnWindowFocus: false,
	});

export const useAnimeTheme = (animeId?: number, themeId?: number) =>
	useQuery({
		queryKey: ['animetheme', animeId, themeId],
		queryFn: () => fetchAnimeTheme(animeId ?? 0, themeId ?? 0),
		enabled: animeId && themeId ? true : false,
	});

export const useArtists = (artists?: Artist[]) =>
	useQuery({
		queryKey: ['artists', artists],
		queryFn: () => fetchArtists(artists ?? []),
		enabled: artists ? true : false,
	});

export const useArtist = (slug?: string) =>
	useQuery({
		queryKey: ['artist', slug],
		queryFn: () => fetchArtist(slug ?? ''),
		enabled: slug ? true : false,
	});

export const useAnime = (slug?: string) =>
	useQuery({
		queryKey: ['anime', slug],
		queryFn: () => fetchAnime(slug ?? ''),
		enabled: slug ? true : false,
	});

export const useSearchAll = (q: string) =>
	useQuery({
		queryKey: ['search', q],
		queryFn: () => fetchSearchAll(q),
		enabled: q.length > 0 ? true : false,
	});

export const useSearchAnime = (query?: string, sort?: SearchAnimeSort) =>
	useInfiniteQuery({
		queryKey: ['animeSearch', query, sort],
		queryFn: ({ pageParam }) => fetchSearchAnime(query, sort, pageParam),
		getNextPageParam: (lastPage) =>
			lastPage.meta.current_page + (lastPage.meta.total === lastPage.meta.to ? 0 : 1),
		initialData: undefined,
		// initialPageParam: undefined,
		initialPageParam: 1,
	});

export const useSearchThemes = (query?: string, sort?: SearchThemesSort) =>
	useInfiniteQuery({
		queryKey: ['animethemeSearch', query, sort],
		queryFn: ({ pageParam }) => fetchSearchThemes(query, sort, pageParam),
		getNextPageParam: (lastPage) =>
			lastPage.meta.current_page + (lastPage.meta.total === lastPage.meta.to ? 0 : 1),
		initialData: undefined,
		// initialPageParam: undefined,
		initialPageParam: 1,
	});

export const useSearchArtists = (query?: string, sort?: SearchArtistsSort) =>
	useInfiniteQuery({
		queryKey: ['artistsSearch', query, sort],
		queryFn: ({ pageParam }) => fetchSearchArtists(query, sort, pageParam),
		getNextPageParam: (lastPage) =>
			lastPage.meta.current_page + (lastPage.meta.total === lastPage.meta.to ? 0 : 1),
		initialData: undefined,
		// initialPageParam: undefined,
		initialPageParam: 1,
	});
