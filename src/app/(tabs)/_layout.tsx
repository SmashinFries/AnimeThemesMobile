import GlobalPlayer from '@/src/components/player';
import { CommonActions } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React from 'react';
import { BottomNavigation, Icon } from 'react-native-paper';

const TabLayout = () => {
	return (
		<Tabs
			initialRouteName="home"
			screenOptions={{ headerShown: false }}
			tabBar={({ navigation, state, descriptors, insets }) => (
				<>
					<BottomNavigation.Bar
						navigationState={state}
						safeAreaInsets={insets}
						shifting
						labeled
						onTabPress={({ route, preventDefault }) => {
							const event = navigation.emit({
								type: 'tabPress',
								target: route.key,
								canPreventDefault: true,
							});

							if (event.defaultPrevented) {
								preventDefault();
							} else {
								navigation.dispatch({
									...CommonActions.navigate(route.name, route.params),
									target: state.key,
								});
							}
						}}
						renderIcon={({ route, focused, color }) => {
							const { options } = descriptors[route.key];
							if (options.tabBarIcon) {
								return options.tabBarIcon({ focused, color, size: 24 });
							}

							return null;
						}}
						// @ts-ignore
						getLabelText={({ route }) => {
							const { options } = descriptors[route.key];
							const label =
								options.tabBarLabel !== undefined
									? options.tabBarLabel
									: options.title !== undefined
										? options.title
										: route.name;

							return label;
						}}
					/>
					<GlobalPlayer />
				</>
			)}>
			<Tabs.Screen name="index" redirect={true} />

			<Tabs.Screen
				name="(home)"
				options={{
					title: 'Home',
					tabBarIcon: (props) => (
						<Icon
							source={props.focused ? 'home' : 'home-outline'}
							color={props.color}
							size={24}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: 'Search',
					tabBarIcon(props) {
						return <Icon source={'magnify'} color={props.color} size={24} />;
					},
				}}
			/>
			<Tabs.Screen
				name="playlists"
				options={{
					title: 'Playlists',
					tabBarIcon(props) {
						return (
							<Icon source={'playlist-music-outline'} color={props.color} size={24} />
						);
					},
				}}
			/>
			<Tabs.Screen
				name="more"
				options={{
					title: 'More',
					tabBarIcon(props) {
						return <Icon source={'dots-horizontal'} color={props.color} size={24} />;
					},
				}}
			/>
		</Tabs>
	);
};

export default TabLayout;
