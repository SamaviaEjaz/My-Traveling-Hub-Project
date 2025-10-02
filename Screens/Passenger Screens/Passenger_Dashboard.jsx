import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from './Home';
import Chat from './ChatTemp';
import GiveComplaint from './GiveComplaint';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

const Passenger_Dashboard = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({ focused }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Chat':
              iconName = 'chatbubble-ellipses';
              break;
            case 'Complaint': // ✅ same as Admin
              iconName = 'alert';
              break;
            case 'Profile':
              iconName = 'person';
              break;
          }

          return (
            <Ionicons
              name={iconName}
              size={25}
              color={focused ? 'blue' : 'gray'}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Chat" component={Chat} options={{ tabBarLabel: 'Chat' }} />
      <Tab.Screen
        name="Complaint"             // ✅ updated name
        component={GiveComplaint}    // ✅ same component but label changed
        options={{ tabBarLabel: 'Complaint' }}
      />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default Passenger_Dashboard;
