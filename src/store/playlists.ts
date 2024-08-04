import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, StateStorage, persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { CustomTrack } from '../types';

const storageId = 'playlist-storage';

const storage = new MMKV({ id: storageId });

const playlistStorage: StateStorage = {
	setItem: (name, value) => {
		return storage.set(name, value);
	},
	getItem: (name) => {
		const value = storage.getString(name);
		return value ?? null;
	},
	removeItem: (name) => {
		return storage.delete(name);
	},
};

export type Playlist = {
	id: number;
	title: string;
	tracks: CustomTrack[];
	description?: string;
	coverImg?: string;
};
type PlaylistState = {
	playlists: Playlist[];
};
type PlaylistAction = {
	createPlaylist: (
		title: string,
		description?: string,
		coverImg?: string,
		tracks?: Playlist['tracks'],
	) => void;
	editPlaylistDetails: (
		id: number,
		title?: string,
		description?: string,
		coverImg?: string,
	) => void;
	deletePlaylist: (id: number) => void;
	addToPlaylist: (id: number, tracks: CustomTrack[]) => void;
	removeFromPlaylist: (id: number, track: CustomTrack) => void;
};

export const usePlaylistStore = create<PlaylistState & PlaylistAction>()(
	persist(
		(set, get) => ({
			playlists: [],
			createPlaylist: (title, description, coverImg, tracks) =>
				set((state) => ({
					playlists: [
						...state.playlists,
						{
							id: state.playlists.length > 0 ? state.playlists.at(-1)?.id + 1 : 0,
							title,
							coverImg,
							description,
							tracks: tracks ?? [],
						},
					],
				})),
			editPlaylistDetails(id, title, description, coverImg) {
				const listIdx = get().playlists.findIndex((playlist) => playlist.id === id);
				const newList = get().playlists;
				newList[listIdx] = {
					...newList[listIdx],
					title: title ?? newList[listIdx].title,
					coverImg: coverImg ?? newList[listIdx].coverImg,
					description: description ?? newList[listIdx].description,
				};

				set(() => ({ playlists: newList }));
			},
			deletePlaylist(id) {
				const newList = get().playlists.filter((val) => val.id !== id);
				// newList.splice(id, 1);
				set({ playlists: newList });
			},
			addToPlaylist(id, tracks) {
				const lists = get().playlists;
				lists[id].tracks?.push(...tracks);
				set({ playlists: lists });
			},
			removeFromPlaylist(id, track) {
				const lists = get().playlists;
				const newTracks = lists[id].tracks.filter((trak) => trak.url !== track.url);
				lists[id].tracks = newTracks;
				set({ playlists: lists });
			},
		}),
		{
			name: storageId,
			storage: createJSONStorage(() => playlistStorage),
		},
	),
);
