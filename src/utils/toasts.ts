import * as Burnt from 'burnt';

export const sendCompletionToast = async (message: string) =>
	await Burnt.toast({ title: message, preset: 'done' });

export const sendToast = async (message: string) => {
	await Burnt.toast({ title: message });
};
