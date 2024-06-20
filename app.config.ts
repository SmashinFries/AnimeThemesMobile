import { ExpoConfig, ConfigContext } from 'expo/config';
const IS_DEV = process.env.APP_VARIANT === 'development';

export default ({ config }: ConfigContext): ExpoConfig => ({
	name: IS_DEV ? 'ATM Dev' : 'AnimeThemesMobile',
	slug: 'AnimeThemesMobile',
	version: '1.0.0',
	orientation: 'portrait',
	icon: './assets/images/icon.png',
	scheme: IS_DEV ? 'atmdev' : 'animethemesmobile',
	userInterfaceStyle: 'automatic',
	splash: {
		image: './assets/images/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#ffffff',
	},
	ios: {
		supportsTablet: true,
	},
	android: {
		package: IS_DEV ? 'com.kuzulabz.atmdev' : 'com.kuzulabz.atm',
		adaptiveIcon: {
			foregroundImage: './assets/images/adaptive-icon.png',
			backgroundColor: '#ffffff',
		},
	},
	web: {
		bundler: 'metro',
		output: 'static',
		favicon: './assets/images/favicon.png',
	},
	plugins: [
		'expo-router',
		'expo-secure-store',
		'expo-video',
		[
			'expo-build-properties',
			{
				android: {
					useLegacyPackaging: true, // keeps the app size smaller but launches slower
					// newArchEnabled: true,
				},
			},
		],
		'expo-asset',
	],
	experiments: {
		typedRoutes: true,
	},
	extra: {
		router: {
			origin: false,
		},
		eas: {
			projectId: 'ae83f124-692c-48cd-9876-2c3575a598b9',
		},
	},
});
