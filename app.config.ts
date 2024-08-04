import { ExpoConfig, ConfigContext } from 'expo/config';
const IS_DEV = process.env.APP_VARIANT === 'development';

const DEEPLINK_HOST = 'animethemes.moe';

export default ({ config }: ConfigContext): ExpoConfig => ({
	name: IS_DEV ? 'AniThemes Dev' : 'AniThemes',
	slug: 'AnimeThemesMobile',
	version: '1.0.0',
	orientation: 'portrait',
	icon: './assets/images/icon.png',
	scheme: IS_DEV ? 'anithemesdev' : 'anithemes',
	userInterfaceStyle: 'automatic',
	splash: {
		image: './assets/images/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#ffffff',
	},
	updates: {
		checkAutomatically: 'ON_LOAD',
		url: 'https://u.expo.dev/ae83f124-692c-48cd-9876-2c3575a598b9',
	},
	runtimeVersion: {
		policy: 'appVersion',
	},
	ios: {
		supportsTablet: true,
	},
	android: {
		package: IS_DEV ? 'com.kuzulabz.anithemesdev' : 'com.kuzulabz.anithemes',
		adaptiveIcon: {
			foregroundImage: './assets/images/adaptive-icon.png',
			backgroundColor: '#ffffff',
		},
		permissions: [
			'REQUEST_INSTALL_PACKAGES',
			'READ_EXTERNAL_STORAGE',
			'WRITE_EXTERNAL_STORAGE',
		],
		intentFilters: [
			{
				action: 'View',
				data: [
					{
						scheme: 'https',
						host: DEEPLINK_HOST,
						pathPrefix: '/anime',
					},
					{
						scheme: 'https',
						host: DEEPLINK_HOST,
						pathPrefix: '/artist',
					},
				],
				category: ['BROWSABLE', 'DEFAULT'],
			},
		],
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
			'expo-font',
			{
				fonts: ['./assets/fonts/Satoshi-Regular.otf'],
			},
		],
		[
			'expo-image-picker',
			{
				photosPermission: 'AniThemes accesses your photos to allow custom playlist images.',
			},
		],
		[
			'expo-build-properties',
			{
				android: {
					useLegacyPackaging: true, // keeps the app size smaller but launches slower
					// newArchEnabled: true,
				},
				ios: {
					deploymentTarget: '13.4',
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
