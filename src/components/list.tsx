import { Stack } from 'expo-router';
import { List, ListItemProps, useTheme } from 'react-native-paper';
import { useHeaderAnim } from '../hooks/useHeaderFade';
import Animated, { FlatListPropsWithLayout } from 'react-native-reanimated';
import { FlatListProps } from 'react-native';
import { AnimHeader } from './headers';

export const ThemedListItem = (props: ListItemProps & { icon: string }) => {
	const { colors } = useTheme();
	return (
		<List.Item
			{...props}
			left={(prop) => <List.Icon {...prop} icon={props.icon} color={colors.primary} />}
		/>
	);
};

type AnimHeaderFlatlistProps = FlatListPropsWithLayout<any> & {
	headerTitle: string;
	shareLink?: string;
	fadeStart?: number;
	fadeEnd?: number;
};
export const AnimHeaderFlatlist = (props: AnimHeaderFlatlistProps) => {
	const headerAnim = useHeaderAnim(props.fadeStart, props.fadeEnd);
	return (
		<>
			<Stack.Screen
				options={{
					title: props.headerTitle,
					headerShown: true,
					headerTransparent: true,
					header: (headerProps) => (
						<AnimHeader {...headerProps} {...headerAnim} shareLink={props.shareLink} />
					),
				}}
			/>
			<Animated.FlatList onScroll={headerAnim.scrollHandler} {...props} />
		</>
	);
};
