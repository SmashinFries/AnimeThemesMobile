import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

export const copyToClipboard = async (text: string) => {
	if (!text) return;
	Clipboard.setStringAsync(text);
	await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export const secToMinString = (seconds: number) =>
	`${(seconds / 60).toFixed(0).padStart(2, '0')}:${(seconds % 60).toFixed(0).padStart(2, '0')}`;
