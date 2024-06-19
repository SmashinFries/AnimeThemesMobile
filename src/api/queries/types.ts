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

type AnimeImageData = {
	id: number;
	facet: string;
	path: string;
	link: string;
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
				anime: {
					id: number;
					name: string;
					slug: string;
					images: AnimeImageData[];
				};
				song: {
					id: number;
					title: string;
					artists: {
						id: number;
						name: string;
						slug: string;
					}[];
				};
			};
		}[];
	}[];
	links: LinksData;
	meta: MetaData;
};
