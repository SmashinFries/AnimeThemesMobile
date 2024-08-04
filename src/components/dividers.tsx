import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

type DividerVerticalProps = {
	size?: number;
	style?: ViewStyle;
};
export const DividerVertical = ({ style, size }: DividerVerticalProps) => {
	const { colors } = useTheme();

	return (
		<View
			style={[
				{
					backgroundColor: colors.outlineVariant,
					height: '100%',
					width: size ?? StyleSheet.hairlineWidth,
				},
				style,
			]}
		/>
	);
};
