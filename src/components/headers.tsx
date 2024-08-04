import { Appbar, AppbarHeaderProps, Divider, useTheme } from 'react-native-paper';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { getHeaderTitle } from '@react-navigation/elements';
import { Linking, Share, View } from 'react-native';
import Color from 'color';
import Animated from 'react-native-reanimated';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PaperHeaderProps = NativeStackHeaderProps & {
	mode?: AppbarHeaderProps['mode'];
	elevated?: AppbarHeaderProps['elevated'];
};
export const PaperHeader = ({
	navigation,
	options,
	route,
	back,
	mode = 'small',
	elevated = false,
}: PaperHeaderProps) => {
	const title = getHeaderTitle(options, route.name);
	// const { colors } = useTheme();

	return (
		<Appbar.Header
			mode={mode}
			elevated={elevated}
			// style={{ backgroundColor: Color(colors.surface).fade(0.8).string() }}
		>
			{back && <Appbar.BackAction onPress={navigation.goBack} />}
			<Appbar.Content title={title} />
		</Appbar.Header>
	);
};

export const MoreHeader = () => {
	const { dark } = useTheme();
	const { top } = useSafeAreaInsets();
	return (
		<Appbar.Header style={{ height: top + 150 }}>
			{/* <Appbar.Content title={title} /> */}
			<Image
				source={require('../../assets/images/adaptive-icon.png')}
				tintColor={dark ? '#FFF' : undefined}
				style={{
					width: '100%',
					height: 180,
					overflow: 'visible',
					alignSelf: 'center',
					// top: -25,
				}}
				// contentFit="contain"
				contentFit="contain"
			/>
		</Appbar.Header>
	);
};

type AnimHeaderProps = NativeStackHeaderProps & {
	headerStyle?: any;
	headerTitleStyle?: any;
	headerActionStyle?: any;
	shareLink?: string;
};
export const AnimHeader = ({
	navigation,
	options,
	route,
	headerActionStyle,
	headerStyle,
	headerTitleStyle,
	shareLink,
}: AnimHeaderProps) => {
	const title = getHeaderTitle(options, route.name);

	return (
		<Animated.View style={[headerStyle]}>
			<Appbar.Header style={{ backgroundColor: 'rgba(0,0,0,0)' }}>
				<Animated.View
					style={[
						{
							borderRadius: 100,
							height: 42,
							width: 42,
							marginLeft: 5,
							justifyContent: 'center',
							alignItems: 'center',
						},
						headerActionStyle,
					]}>
					<Appbar.BackAction
						onPress={() => {
							navigation.goBack();
							// onBack ? onBack() : null;
						}}
					/>
				</Animated.View>
				<Animated.View
					style={[
						headerTitleStyle,
						{
							flex: 1,
							height: '50%',
							justifyContent: 'center',
						},
					]}>
					<Appbar.Content
						title={title ?? ''}
						titleStyle={{ textTransform: 'capitalize' }}
					/>
				</Animated.View>
				{shareLink && (
					<Animated.View
						style={[
							{
								borderRadius: 100,
								height: 42,
								width: 42,
								marginRight: 10,
								justifyContent: 'center',
								alignItems: 'center',
							},
							headerActionStyle,
						]}>
						<Appbar.Action
							icon="share-variant-outline"
							onPress={() =>
								Share.share({
									url: shareLink,
									title: shareLink,
									message: shareLink,
								})
							}
							disabled={!shareLink}
						/>
					</Animated.View>
				)}
				{/* {shareLink && onEdit && streamingLinks?.length > 0 && (
					<Animated.View style={[HeaderStyles.icon, headerActionStyle]}>
						<Menu
							visible={moreVisible}
							onDismiss={closeMoreMenu}
							anchorPosition="bottom"
							anchor={<Appbar.Action icon="dots-vertical" onPress={openMoreMenu} />}>
							<Menu.Item
								leadingIcon={'file-document-edit-outline'}
								onPress={onEdit}
								title={'Edit Data'}
							/>
							<Menu.Item
								leadingIcon={'share-variant-outline'}
								onPress={() =>
									Share.share({
										url: shareLink,
										title: shareLink,
										message: shareLink,
									})
								}
								title={'Share'}
							/>
						</Menu>
					</Animated.View>
				)} */}
			</Appbar.Header>
		</Animated.View>
	);
};

type PlaylistsHeaderProps = PaperHeaderProps & {
	onAddPlaylist: () => void;
};
export const PlaylistsHeader = ({
	navigation,
	options,
	route,
	back,
	onAddPlaylist,
	mode = 'small',
	elevated = false,
}: PlaylistsHeaderProps) => {
	const title = getHeaderTitle(options, route.name);
	// const { colors } = useTheme();

	return (
		<Appbar.Header
			mode={mode}
			elevated={elevated}
			// style={{ backgroundColor: Color(colors.surface).fade(0.8).string() }}
		>
			{back && <Appbar.BackAction onPress={navigation.goBack} />}
			<Appbar.Content title={title} />
			<Appbar.Action icon={'plus'} onPress={onAddPlaylist} />
		</Appbar.Header>
	);
};
