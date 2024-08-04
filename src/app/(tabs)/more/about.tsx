import { StackView } from '@/src/components/view';
import { openWebBrowser } from '@/src/utils/browser';
import axios from 'axios';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, IconButton, List, Surface, Text } from 'react-native-paper';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { copyToClipboard } from '@/src/utils/text';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { useActiveTrack } from 'react-native-track-player';

type LinkButtonProps = {
	url: string;
	icon: IconSource;
	label?: string;
	iconColor?: string;
	transparentBg?: boolean;
	bgColor?: string;
	size?: number;
};
export const LinkButton = ({
	url,
	icon,
	label,
	iconColor,
	transparentBg,
	bgColor,
	size,
}: LinkButtonProps) => {
	return (
		<View style={{ alignItems: 'center', marginHorizontal: 10, marginBottom: 20 }}>
			<IconButton
				mode="contained"
				size={size ?? 36}
				iconColor={iconColor ?? undefined}
				icon={icon}
				onPress={() => openWebBrowser(url)}
				onLongPress={() => copyToClipboard(url)}
				style={[
					transparentBg && { backgroundColor: 'transparent', borderRadius: 0 },
					bgColor && { backgroundColor: bgColor },
				]}
			/>
			{label ? <Text numberOfLines={2}>{label}</Text> : null}
		</View>
	);
};

const OtherAppItem = ({
	title,
	imgUrl,
	link,
	status = 'Coming Soon!',
}: {
	title: string;
	imgUrl?: string;
	link?: string;
	status?: string;
}) => {
	return (
		<Pressable
			onPress={() => openWebBrowser(link ?? null)}
			style={{ maxWidth: 100, marginHorizontal: 10 }}>
			<Surface
				elevation={2}
				style={{
					borderRadius: 12,
					justifyContent: 'center',
					alignItems: 'center',
					height: 90,
					width: 90,
				}}>
				{imgUrl ? (
					<Image
						source={{
							uri: imgUrl,
						}}
						style={{ height: '100%', width: '100%' }}
						contentFit="contain"
					/>
				) : (
					<Text style={{ textAlign: 'center' }}>{status}</Text>
				)}
			</Surface>
			<Text numberOfLines={2} style={{ paddingTop: 5, textAlign: 'center' }}>
				{title}
			</Text>
		</Pressable>
	);
};

const AboutPage = () => {
	const activeTrack = useActiveTrack();

	return (
		<StackView>
			<List.Item
				title={'Version'}
				description={`${Constants?.expoConfig?.version}`}
				descriptionStyle={{ textTransform: 'capitalize' }}
				descriptionNumberOfLines={3}
			/>
			<List.Accordion title={'Other Apps'}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<OtherAppItem
						title={'Goraku'}
						imgUrl="https://raw.githubusercontent.com/KuzuLabz/GorakuSite/main/public/logo.png"
						link="https://goraku.kuzulabz.com/"
					/>
					<OtherAppItem
						title={'VNBrowser'}
						imgUrl="https://raw.githubusercontent.com/SmashinFries/VNBrowser/master/assets/adaptive-icon.png?raw=true"
						link="https://github.com/KuzuLabz/WaifuTagger"
					/>
					<OtherAppItem
						title={'WaifuTagger'}
						imgUrl="https://github.com/KuzuLabz/WaifuTagger/blob/master/assets/adaptive-icon.png?raw=true"
						link="https://github.com/KuzuLabz/WaifuTagger"
					/>
				</ScrollView>
			</List.Accordion>
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'flex-end',
					paddingBottom: activeTrack ? 90 : 0,
				}}>
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'flex-end',
						marginBottom: 10,
					}}>
					<Text>Created by KuzuLabz ❤️</Text>
				</View>

				<View
					style={{
						alignItems: 'flex-end',
						justifyContent: 'center',
						flexDirection: 'row',
					}}>
					<LinkButton url="https://kuzulabz.com/" icon={'earth'} size={28} />
					<LinkButton
						url="https://www.kuzumerch.com"
						icon={'storefront-outline'}
						size={28}
					/>
				</View>
			</View>
		</StackView>
	);
};

export default AboutPage;
