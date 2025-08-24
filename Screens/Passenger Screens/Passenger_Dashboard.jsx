import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Chat from './ChatTemp';
import Feedback from './Feedback';
import Home from './Home';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

const Passenger_Dashboard = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home}/>
      <Tab.Screen name="Chat" component={Chat} />  
      <Tab.Screen name="Feedback" component={Feedback} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Passenger_Dashboard;
