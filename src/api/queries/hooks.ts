import { useQuery } from '@tanstack/react-query';
import { fetchMostViewed, fetchRecentlyAdded } from './queries';

export const useRecentlyAdded = (enabled = true) =>
	useQuery({
		queryKey: ['recently_added'],
		queryFn: () => fetchRecentlyAdded(),
		enabled: enabled,
	});

export const useMostViewed = (enabled = true) =>
	useQuery({
		queryKey: ['most_viewed'],
		queryFn: () => fetchMostViewed(),
		enabled: enabled,
	});
