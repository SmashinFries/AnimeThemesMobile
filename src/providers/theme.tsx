import { DarkTheme as NavDarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ReactNode, useEffect } from 'react';
import {
	adaptNavigationTheme,
	MD3DarkTheme,
	MD3LightTheme,
	MD3Theme,
	PaperProvider,
} from 'react-native-paper';
import { useThemeStore } from '../store/theme';
import { StatusBar, setStatusBarStyle } from 'expo-status-bar';

const PaperLightTheme: MD3Theme = {
	...MD3LightTheme,
	fonts: {
		...MD3LightTheme.fonts,
		default: {
			...MD3LightTheme.fonts.default,
			fontFamily: 'Satoshi-Regular',
		},
	},
};

const PaperDarkTheme: MD3Theme = {
	...MD3DarkTheme,
	fonts: {
		...MD3DarkTheme.fonts,
		default: {
			...MD3DarkTheme.fonts.default,
			fontFamily: 'Satoshi-Regular',
		},
	},
};

const AMOLEDDarkTheme: MD3Theme = {
	...MD3DarkTheme,
	fonts: {
		...MD3DarkTheme.fonts,
		default: {
			...MD3DarkTheme.fonts.default,
			fontFamily: 'Satoshi-Regular',
		},
	},
	colors: {
		...MD3DarkTheme.colors,
		background: '#000000',
		surface: '#000001',
	},
};

const { LightTheme, DarkTheme } = adaptNavigationTheme({
	reactNavigationLight: DefaultTheme,
	reactNavigationDark: NavDarkTheme,
	materialDark: PaperDarkTheme,
	materialLight: PaperLightTheme,
});

type PaperThemeProviderProps = {
	children: ReactNode;
};
export const PaperThemeProvider = ({ children }: PaperThemeProviderProps) => {
	const { isDarkMode, isPureBlackMode } = useThemeStore();

	useEffect(() => {
		// StatusBar style doesnt react to state so we update it here
		setStatusBarStyle(isDarkMode ? 'light' : 'dark', true);
	}, [isDarkMode]);

	return (
		<PaperProvider
			theme={
				isDarkMode ? (isPureBlackMode ? AMOLEDDarkTheme : PaperDarkTheme) : PaperLightTheme
			}>
			<ThemeProvider value={isDarkMode ? DarkTheme : LightTheme}>
				{children}
				<StatusBar translucent style={isDarkMode ? 'light' : 'dark'} />
			</ThemeProvider>
		</PaperProvider>
	);
};
