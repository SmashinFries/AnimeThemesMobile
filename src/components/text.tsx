import { View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

type TitleDetailProps = {
	text: string;
	icon: string;
};
export const TitleDetail = ({ text, icon }: TitleDetailProps) => {
	const { colors } = useTheme();
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
			{/* Works fine without size \0_0/ */}
			{/* @ts-ignore */}
			<Icon source={icon} />
			<Text
				variant="labelMedium"
				style={{ paddingHorizontal: 6, color: colors.onSurfaceVariant }}>
				{text}
			</Text>
		</View>
	);
};
