import { ThemeProvider, DarkTheme as NavDarkTheme, DefaultTheme } from '@react-navigation/native';
import {
	PaperProvider,
	adaptNavigationTheme,
	MD3DarkTheme,
	MD3LightTheme,
} from 'react-native-paper';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from 'react-native';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
	reactNavigationLight: DefaultTheme,
	reactNavigationDark: NavDarkTheme,
	materialDark: MD3DarkTheme,
	materialLight: MD3LightTheme,
});

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export const RootLayout = () => {
	const colorScheme = useColorScheme();

	return (
		<PaperProvider theme={colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme}>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : LightTheme}>
				<QueryClientProvider client={queryClient}>
					<Stack initialRouteName="(tabs)">
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					</Stack>
				</QueryClientProvider>
			</ThemeProvider>
		</PaperProvider>
	);
};
