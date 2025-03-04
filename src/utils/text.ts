import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

export const copyToClipboard = async (text?: string) => {
	if (!text) return;
	Clipboard.setStringAsync(text);
	await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export const secToMinString = (seconds: number) =>
	`${Math.floor(Math.round(seconds) / 60)
		.toFixed(0)
		.padStart(2, '0')}:${(Math.round(seconds) % 60).toFixed(0).padStart(2, '0')}`;

// export const compressTrack = (track: CustomTrack): string => {
// 	return '';
// };
