import { StackView } from '@/src/components/view';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const AccountPage = () => {
	return (
		<StackView>
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Text variant="titleMedium">Account features coming soon{'\n'}</Text>
				<Text>
					This will include managing your playlists from your AnimeThemes account!
				</Text>
			</View>
		</StackView>
	);
};

export default AccountPage;
