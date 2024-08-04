import { ThemedListItem } from '@/src/components/list';
import { StackView } from '@/src/components/view';
import { router } from 'expo-router';
import { Divider } from 'react-native-paper';

const MorePage = () => {
	return (
		<StackView>
			<Divider style={{ height: 1 }} />
			{/* <ThemedListItem title={'Download Queue'} icon="download-outline" />
			<ThemedListItem
				title={'Offline Mode'}
				description={'Only show downloaded songs and playlists'}
				descriptionNumberOfLines={2}
				icon="lan-disconnect"
				right={(props) => <Switch {...props} />}
			/>
			<Divider style={{ height: 1 }} /> */}
			<ThemedListItem
				title={'Account'}
				icon="account-outline"
				onPress={() => router.push('/more/account')}
			/>
			<ThemedListItem
				title={'Settings'}
				icon="cog-outline"
				onPress={() => router.push('/more/settings')}
			/>
			<ThemedListItem
				title={'About'}
				icon="information-outline"
				onPress={() => router.push('/more/about')}
			/>
		</StackView>
	);
};

export default MorePage;
