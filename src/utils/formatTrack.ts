import { ExploreDataResponse, ExploreDataTracks } from '../api/queries/types';
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
