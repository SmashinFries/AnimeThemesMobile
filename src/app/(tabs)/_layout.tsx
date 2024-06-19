import { TabBarIcon } from '@/src/components/navigation/TabBarIcon';
import { Tabs } from 'expo-router';
import React from 'react';

export const TabLayout = () => {
	return (
		<Tabs
			initialRouteName="home"
			screenOptions={{
				headerShown: false,
			}}>
			<Tabs.Screen name="index" redirect={true} />
			<Tabs.Screen
				name="home"
				options={{
					title: 'Home',
					tabBarIcon: ({ color, focused }) => (
						<TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
					),
				}}
			/>
		</Tabs>
	);
};
