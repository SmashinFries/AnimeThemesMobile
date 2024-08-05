import { MaterialSwitchListItem } from '@/src/components/switches/switchListItem';
import { StackView } from '@/src/components/view';
import { useThemeStore } from '@/src/store/theme';
import { ActivityAction, startActivityAsync } from 'expo-intent-launcher';
import { List } from 'react-native-paper';
import * as Linking from 'expo-linking';

const SettingsPage = () => {
	const { isDarkMode, isPureBlackMode, setIsDarkMode, setIsPureBlackMode } = useThemeStore();
	return (
		<StackView>
			<List.Item
				title={'Enable Supported Links'}
				description={'Go to "Defaults" -> "Set as default"'}
				right={(props) => <List.Icon {...props} icon={'open-in-new'} />}
				onPress={() => Linking.openSettings()}
			/>
			<MaterialSwitchListItem
				title="Dark Mode"
				selected={isDarkMode}
				onPress={() => setIsDarkMode(!isDarkMode)}
				fluid
			/>
			<MaterialSwitchListItem
				title="AMOLED Mode"
				selected={isPureBlackMode}
				onPress={() => setIsPureBlackMode(!isPureBlackMode)}
				fluid
				disabled={!isDarkMode}
			/>
			{/* <List.Item
				title={'Dark Mode'}
				right={(props) => (
					<Switch
						// {...props}
						style={[props.style]}
						value={isDarkMode}
						onValueChange={(val) => setIsDarkMode(val)}
					/>
				)}
			/> */}
		</StackView>
	);
};

export default SettingsPage;
