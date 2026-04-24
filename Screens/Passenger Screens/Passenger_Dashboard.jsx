import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from './Home';
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
            // case 'Chat':
            //   iconName = 'chatbubble-ellipses';
            //   break;
            case 'Complaint': 
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
      <Tab.Screen
        name="Complaint"             
        component={GiveComplaint}    
        options={{ tabBarLabel: 'Complaint' }}
      />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default Passenger_Dashboard;
