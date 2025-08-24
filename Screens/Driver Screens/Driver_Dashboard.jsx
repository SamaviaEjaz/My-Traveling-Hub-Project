import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from './Home';
import Chat from './ChatTemp';
import Feedback from './Feedback';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

const Passenger_Dashboard = () => {
  return (
    <Tab.Navigator
      Options={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let iconName;
          let iconSize = 30;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Chat':
              iconName = 'chatbubbles';
              break;
            case 'Feedback':
              iconName = 'star';
              iconSize = focused ? 35 : 30; 
              break;
            case 'Profile':
              iconName = 'person';
              break;
          }

          return <Ionicons name={iconName} size={iconSize} color={focused ? 'blue' : 'gray'} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Feedback" component={Feedback} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Passenger_Dashboard;
