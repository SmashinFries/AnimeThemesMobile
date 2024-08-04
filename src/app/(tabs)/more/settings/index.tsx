import { MaterialSwitchListItem } from '@/src/components/switches/switchListItem';
import { StackView } from '@/src/components/view';
import { useThemeStore } from '@/src/store/theme';

const SettingsPage = () => {
	const { isDarkMode, isPureBlackMode, setIsDarkMode, setIsPureBlackMode } = useThemeStore();
	return (
		<StackView>
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
