import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, StateStorage, persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { Track } from 'react-native-track-player';

const storage = new MMKV({ id: 'lastTrack-storage' });

const lastTrackStorage: StateStorage = {
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

type LastTrackState = {
	track: Track | null;
	position: number;
};
type LastTrackAction = {
	saveTrack: (track: Track | undefined | null) => void;
	savePosition: (position: number) => void;
};

export const useLastTrackStore = create<LastTrackState & LastTrackAction>()(
	persist(
		(set, get) => ({
			track: null,
			position: 0,
			saveTrack: (track) => set({ track }),
			savePosition: (position) => set({ position }),
		}),
		{
			name: 'lastTrack-storage',
			storage: createJSONStorage(() => lastTrackStorage),
		},
	),
);
