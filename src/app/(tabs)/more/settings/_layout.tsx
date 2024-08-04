import { MoreHeader, PaperHeader } from '@/src/components/headers';
import { Stack } from 'expo-router';

const SettingsLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{ title: 'Settings', header: (props) => <PaperHeader {...props} /> }}
			/>
		</Stack>
	);
};

export default SettingsLayout;
