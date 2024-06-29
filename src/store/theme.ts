import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, StateStorage, persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'theme-storage' });

const themeStorage: StateStorage = {
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

type ThemeState = {
	isDarkMode: boolean;
	isPureBlackMode: boolean;
};
type ThemeAction = {
	setIsDarkMode: (enable: boolean) => void;
	setIsPureBlackMode: (enable: boolean) => void;
};

export const useThemeStore = create<ThemeState & ThemeAction>()(
	persist(
		(set, get) => ({
			isPureBlackMode: false,
			isDarkMode: Appearance.getColorScheme() === 'dark',
			setIsDarkMode: (enable) => set({ isDarkMode: enable }),
			setIsPureBlackMode: (enable) => set({ isPureBlackMode: enable }),
		}),
		{
			name: 'settings-storage',
			storage: createJSONStorage(() => themeStorage),
		},
	),
);
