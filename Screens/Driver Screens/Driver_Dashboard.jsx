import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import Home from './Home';
import Chat from './ChatTemp';
import Reviews from './Reviews';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

const Driver_Dashboard = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { 
          height: 90,        
          paddingBottom: 12, 
          paddingTop: 12,    
        },
        tabBarItemStyle: {
          marginHorizontal: -5, 
        },
        tabBarIcon: ({ focused }) => {
          let iconName;
          let label;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              label = 'Home';
              break;
            case 'Chat':
              iconName = 'chatbubble-ellipses';
              label = 'Chat';
              break;
            case 'Reviews':
              iconName = 'star';
              label = 'Feedback';
              break;
            case 'Profile':
              iconName = 'person';
              label = 'Profile';
              break;
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={iconName} size={25} color={focused ? 'blue' : 'gray'} />
              <Text
                style={{
                  fontSize:7,
                  color: focused ? 'blue' : 'gray',
                  marginTop:5, 
                  textAlign: 'center',
                 
                }}
              >
                {label}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Reviews" component={Reviews} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Driver_Dashboard;
