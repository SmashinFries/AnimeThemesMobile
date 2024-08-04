import { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

/**
 * A View parent with correct theming for stack pages
 * @param props - any view props
 * @returns React.JSX.Element
 */
export const StackView = (props: ViewProps) => {
	const { colors } = useTheme();
	return (
		<View {...props} style={[props.style, { flex: 1, backgroundColor: colors.background }]}>
			{props.children}
		</View>
	);
};

type LoadingViewProps = {
	isLoading: boolean;
	children: ReactNode;
};
/**
 * A View parent for pages with fetched data
 * @param isLoading
 * @returns React.JSX.Element
 */
export const LoadingView = ({ isLoading, children }: LoadingViewProps) => {
	return (
		<StackView>
			{isLoading && (
				<Animated.View
					entering={FadeIn}
					exiting={FadeOut}
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator size={'large'} />
				</Animated.View>
			)}
			{!isLoading && (
				<Animated.View entering={FadeIn} exiting={FadeOut}>
					{children}
				</Animated.View>
			)}
		</StackView>
	);
};
