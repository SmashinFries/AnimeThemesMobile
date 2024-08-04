import React from 'react';
import { Icon, Portal } from 'react-native-paper';
import { Drawer } from 'expo-router/drawer';
import { Drawer as PaperDrawer } from 'react-native-paper';
import { DrawerContent } from '@react-navigation/drawer';
import GlobalPlayer from '@/src/components/player';

const TabLayout = () => {
	return (
		<>
			<Drawer
				drawerContent={(props) => (
					<>
						<DrawerContent {...props}>
							<PaperDrawer.Item label="Test" />
						</DrawerContent>
					</>
				)}
				screenOptions={{ drawerPosition: 'left' }}>
				<Drawer.Screen name="index" redirect={true} />
				<Drawer.Screen
					name="(home)"
					options={{
						title: 'Home',
						drawerIcon: (props) => (
							<Icon
								source={props.focused ? 'home' : 'home-outline'}
								color={props.color}
								size={24}
							/>
						),
					}}
				/>
				<Drawer.Screen
					name="(search)"
					options={{
						title: 'Search',
						drawerIcon: (props) => {
							return <Icon source={'magnify'} color={props.color} size={24} />;
						},
					}}
				/>
				<Drawer.Screen
					name="(more)"
					options={{
						title: 'More',
						drawerIcon: (props) => {
							return (
								<Icon source={'dots-horizontal'} color={props.color} size={24} />
							);
						},
					}}
				/>
			</Drawer>
			<Portal>
				<GlobalPlayer />
			</Portal>
		</>
	);
};

export default TabLayout;
