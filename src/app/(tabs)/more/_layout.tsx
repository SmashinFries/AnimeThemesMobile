import { MoreHeader, PaperHeader } from '@/src/components/headers';
import { Stack } from 'expo-router';

const MoreLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerShown: true,
				animation: 'fade',
				header: (props) => <PaperHeader {...props} />,
			}}>
			<Stack.Screen
				name="index"
				options={{ headerShown: true, header: () => <MoreHeader /> }}
			/>
			<Stack.Screen name="settings" options={{ headerShown: false }} />
			<Stack.Screen name="about" options={{ title: 'About' }} />
			<Stack.Screen name="account" options={{ title: 'Account' }} />
		</Stack>
	);
};

export default MoreLayout;
