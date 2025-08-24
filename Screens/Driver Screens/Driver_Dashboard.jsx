import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Chat from './ChatTemp';
import Home from './Home';
import Profile from './Profile';
import Reviews from './Reviews';

const Tab = createBottomTabNavigator();

const Driver_Dashboard = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Reviews" component={Reviews} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Driver_Dashboard;
