// Driver_Dashboard.js
import React, { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DriverContext } from './DriverContext';
import Home from './Home';
// import Chat from './ChatTemp';
import Reviews from './DriverReviews';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

const Driver_Dashboard = ({ route }) => {
  const { 
    driverName: contextDriverName, 
    saveDriverName, 
    clearAllUserData,
    createUserSession, 
    userSessionId
  } = useContext(DriverContext);
  const [driverName, setDriverName] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const handleUserLogin = async () => {
      try {
        if (route.params?.driverName) {
          await clearAllUserData();
          
          const newDriverName = route.params.driverName;
          setDriverName(newDriverName);
          await saveDriverName(newDriverName);
          
          await createUserSession(newDriverName);
          
          console.log(`New user logged in: ${newDriverName}`);
        } else {
          const name = contextDriverName || await AsyncStorage.getItem('driverName');
          if (name) {
            setDriverName(name);
          } else {
            setDriverName("Driver");
          }
        }
      } catch (error) {
        console.error("Error handling user login:", error);
        setDriverName("Driver");
      } finally {
        setIsInitialized(true);
      }
    };
    
    handleUserLogin();
  }, [route.params?.driverName, contextDriverName, saveDriverName, clearAllUserData, createUserSession]); // Fixed: Added createUserSession to dependency array

  const resetTabScreens = () => {
    return {
      driverName,
      key: `${driverName || 'default'}-${userSessionId || 'no-session'}`, // Force re-mount when driver changes
    };
  };

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      key={userSessionId || 'default'} 
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
            // case 'Chat':
            //   iconName = 'chatbubble-ellipses';
            //   label = 'Chat';
            //   break;
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
      <Tab.Screen 
        name="Home" 
        component={Home} 
        initialParams={resetTabScreens()} 
      />
      {/* <Tab.Screen 
        name="Chat" 
        component={Chat} 
        initialParams={resetTabScreens()} 
      /> */}
      <Tab.Screen 
        name="Reviews" 
        component={Reviews} 
        initialParams={resetTabScreens()} 
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        initialParams={resetTabScreens()} 
      />
    </Tab.Navigator>
  );
};

export default Driver_Dashboard;