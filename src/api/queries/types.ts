import { CustomTrack } from '@/src/types';
import { AddTrack } from 'react-native-track-player';

type MetaData = {
	current_page: number;
	from: number;
	path: string;
	per_page: number;
	to: number;
};

type LinksData = {
	first: string | null;
	last: string | null;
	prev: string | null;
	next: string | null;
};

type AudioData = {
	id: number;
	basename: string;
	filename: string;
	path: string;
	size: number;
	link: string;
};

type ImageData = {
	id: number;
	facet: string;
	path: string;
	link: string;
};

type Song = {
	id: number;
	title: string;
	created_at: string;
	updated_at: string;
};

export type Artist = {
	id: number;
	name: string;
	slug: string;
	artistsong: {
		as: null;
	};
};

export type Video = {
	id: number;
	basename: string;
	filename: string;
	lyrics: boolean;
	nc: boolean;
	overlap: string;
	path: string;
	resolution: number;
	size: number;
	source: string;
	subbed: boolean;
	uncen: boolean;
	tags: string;
	link: string;
	audio: AudioData;
};

export type Anime = {
	id: number;
	name: string;
	slug: string;
	synopsis: string;
	media_format: string;
	season: string;
	year: number;
};

export type PageParams = {
	'page[number]': number;
	'page[size]': number;
};

export type ExploreDataParams = PageParams & {
	sort: '-created_at' | '-views_count' | 'random';
	include: string;
	'fields[video]': string;
	'fields[animetheme]': string;
	'fields[anime]': string;
};

export type ExploreDataResponse = {
	videos: {
		id: number;
		path: string;
		link: string;
		basename: string;
		audio: AudioData;
		animethemeentries: {
			id: number;
			episodes: string;
			notes: string | null;
			nsfw: boolean;
			spoiler: boolean;
			version: number | null;
			animetheme: {
				id: number;
				// id,type,slug
				type: string;
				slug: string;
				anime: {
					id: number;
					name: string;
					slug: string;
					images: ImageData[];
					media_format: string;
					season: string;
					year: number;
				};
				song: {
					id: number;
					title: string;
					artists: Artist[];
				};
			};
		}[];
	}[];
	links: LinksData;
	meta: MetaData;
};

export type ExploreDataTracks = ExploreDataResponse & {
	tracks: CustomTrack[];
};

export type Resource = {
	id: number;
	external_id: number;
	link: string;
	site: string;
};

export type Studio = {
	id: number;
	name: string;
	slug: string;
};

export type AnimeSynonym = {
	id: number;
	text: string;
	type: string; // language
};

export type AnimeThemeEntry = {
	id: number;
	episodes: string;
	notes: string | null;
	nsfw: boolean;
	spoiler: boolean;
	version: number | null;
	videos: {
		id: number;
		basename: string;
		filename: string;
		lyrics: boolean;
		nc: boolean;
		overlap: string;
		path: string;
		resolution: number;
		size: number;
		source: string;
		subbed: boolean;
		uncen: boolean;
		tags: string;
		link: string;
		audio: AudioData;
	}[];
};

export type AnimeTheme = {
	id: number;
	sequence: number;
	slug: string;
	type: string;
};

export type AnimeResponse = {
	anime: {
		id: number;
		name: string;
		media_format: string;
		season: string;
		slug: string;
		synopsis: string;
		year: number;
		resources: Resource[];
		images: ImageData[];
		studios: Studio[];
		animesynonyms: AnimeSynonym[];
		animethemes: (AnimeTheme & {
			animethemeentries: AnimeThemeEntry[];
			song: Song & { artists: Artist[] };
		})[];
	};
};

export type AnimeThemeVideo = {
	id: number;
	basename: string;
	filename: string;
	lyrics: boolean;
	nc: boolean;
	overlap: string;
	path: string;
	resolution: number;
	size: number;
	source: string;
	subbed: boolean;
	uncen: boolean;
	tags: string;
	link: string;
	audio: AudioData;
};

export type AnimeThemeResponse = {
	animetheme: {
		id: number;
		sequence: number;
		slug: string;
		type: string;
		anime: {
			id: number;
			name: string;
			media_format: string;
			season: string;
			slug: string;
			synopsis: string;
			year: number;
			images: ImageData[];
		};
		animethemeentries: {
			id: number;
			episodes: string;
			notes: string | null;
			nsfw: boolean;
			spoiler: boolean;
			version: string | null;
			videos: AnimeThemeVideo[];
		}[];
		song: {
			id: number;
			title: string;
			artists: Artist[];
		};
	};
};

export type ArtistsResponse = {
	artists: {
		id: number;
		name: string;
		slug: string;
		members: [];
		images: ImageData[];
	}[];
	links: LinksData;
	meta: MetaData;
};

export type ArtistResponse = {
	artist: {
		id: number;
		name: string;
		slug: string;
		members: {
			id: number;
			name: string;
			slug: string;
			created_at: string;
			updated_at: string;
			artistmember: {
				as: string | null;
			};
		}[];
		images: ImageData[];
		songs: (Song & {
			artists: Artist[];
			animethemes: (AnimeTheme & {
				anime: {
					id: number;
					name: string;
					media_format: string;
					season: string;
					slug: string;
					synopsis: string;
					year: number;
					images: ImageData[];
				};
				animethemeentries: {
					id: number;
					episodes: string;
					notes: string;
					nsfw: boolean;
					spoiler: boolean;
					version: number | null;
					videos: Video[];
				}[];
			})[];
		})[];
		resources: (Resource & {
			artistresource: {
				as: string | null;
			};
		})[];
	};
};

export type SearchAllResponse = {
	search: {
		anime: (Anime & {
			images: ImageData[];
		})[];
		animethemes: (AnimeTheme & {
			anime: Anime & { images: ImageData[] };
			animethemeentries: AnimeThemeEntry[];
			song: Song & {
				artists: Artist[];
			};
			track?: CustomTrack;
		})[];
		artists: (Artist & {
			images: ImageData[];
		})[];
	};
};

export type SearchAnimeSort =
	| 'id'
	| 'name'
	| 'slug'
	| 'year'
	| 'season'
	| 'media_format'
	| 'synopsis'
	| 'created_at'
	| 'updated_at';
export type SearchAnimeResponse = {
	anime: (Anime & { images: ImageData[] })[];
	meta: MetaData & { total: number };
	links: LinksData;
};

export type SearchThemesSort =
	| 'id'
	| 'type'
	| 'sequence'
	| 'slug'
	| 'created_at'
	| 'updated_at'
	| 'random';

export type SearchThemesResponse = {
	animethemes: (AnimeTheme & {
		anime: Anime & { images: ImageData[] };
		animethemeentries: AnimeThemeEntry[];
		song: Song & { artists: Artist[] };
		track?: CustomTrack;
	})[];
	links: LinksData;
	meta: MetaData & { total: number };
};

export type SearchThemesTracks = ExploreDataResponse & {
	tracks: CustomTrack[];
};

export type SearchArtistsSort = 'id' | 'name' | 'slug' | 'created_at' | 'updated_at' | 'random';
export type SearchArtistsResponse = {
	artists: (Artist & { images: ImageData[] })[];
	links: LinksData;
	meta: MetaData & { total: number };
};
