import { DarkTheme as NavDarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ReactNode, useEffect } from 'react';
import {
	adaptNavigationTheme,
	configureFonts,
	MD3DarkTheme,
	MD3LightTheme,
	MD3Theme,
	PaperProvider,
} from 'react-native-paper';
import { useThemeStore } from '../store/theme';
import { setStatusBarBackgroundColor, setStatusBarStyle } from 'expo-status-bar';
import { MD3Type } from 'react-native-paper/lib/typescript/types';

const fontConfig: {
	config?: Partial<MD3Type>;
	isV3?: true;
} = {
	isV3: true,
	config: {
		fontFamily: 'Satoshi-Regular',
	},
};

const PaperLightTheme: MD3Theme = {
	...MD3LightTheme,
	fonts: configureFonts(fontConfig),
};

const PaperDarkTheme: MD3Theme = {
	...MD3DarkTheme,
	fonts: configureFonts(fontConfig),
};

const AMOLEDDarkTheme: MD3Theme = {
	...MD3DarkTheme,
	fonts: configureFonts(fontConfig),
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
		setStatusBarBackgroundColor(
			(isDarkMode ? (isPureBlackMode ? AMOLEDDarkTheme : PaperDarkTheme) : PaperLightTheme)
				.colors.background,
			true,
		);
		setStatusBarStyle(isDarkMode ? 'light' : 'dark', true);
	}, [isDarkMode, isPureBlackMode]);

	return (
		<PaperProvider
			theme={
				isDarkMode ? (isPureBlackMode ? AMOLEDDarkTheme : PaperDarkTheme) : PaperLightTheme
			}>
			<ThemeProvider value={isDarkMode ? DarkTheme : LightTheme}>
				{children}
				{/* <StatusBar translucent style={isDarkMode ? 'light' : 'dark'} /> */}
			</ThemeProvider>
		</PaperProvider>
	);
};
