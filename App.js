import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';


import WelCome from './Screens/Home Screens/WelCome';
import LoginPage from './Screens/Home Screens/LoginPage';
import Register from './Screens/Home Screens/Register';
import AdminLogin from './Screens/Home Screens/Admin Login';
import DriverRegister from './Screens/Home Screens/DriverRegister';
import UploadImages from './Screens/Home Screens/UploadImages';
import PassengerRegister from './Screens/Home Screens/PassengerRegister';
import Forget from './Screens/Home Screens/Forget';
import OTP from './Screens/Home Screens/OTP';
import ResetPassword from './Screens/Home Screens/Reset Password';
import Pending from './Screens/Home Screens/Pending';

import AdminDashboard from './Screens/Admin_Dashboard/AdminDashboard';
import AdminHome from './Screens/Admin_Dashboard/Home';
import AdminProfile from './Screens/Admin_Dashboard/Profile';
import AdminFeedback from './Screens/Admin_Dashboard/Feedback';
import DriversAuthorization from './Screens/Admin_Dashboard/DriversAuthorization';
import UpdateProfile from './Screens/Admin_Dashboard/Update Profile';

import Driver_Dashboard from './Screens/Driver Screens/Driver_Dashboard';
import DriverHome from './Screens/Driver Screens/Home';
import DriverProfile from './Screens/Driver Screens/Profile';
import DriverFeedback from './Screens/Driver Screens/Feedback';
import DriverChat from './Screens/Driver Screens/ChatTemp';
import DriverMessages from './Screens/Driver Screens/Messages';
import SharePost from './Screens/Driver Screens/Share Post';
import ReceiveRequest from './Screens/Driver Screens/Receive Request';



import Passenger_Dashboard from './Screens/Passenger Screens/Passenger_Dashboard';
import PassengerHome from './Screens/Passenger Screens/Home';
import PassengerProfile from './Screens/Passenger Screens/Profile';
import PassengerFeedback from './Screens/Passenger Screens/Feedback';
import PassengerChat from './Screens/Passenger Screens/ChatTemp';
import Messages from './Screens/Passenger Screens/Messages';
import GetRide from './Screens/Passenger Screens/Get Ride';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelCome">


        <Stack.Screen name="WelCome" component={WelCome} />
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ title: 'LoginPage', headerStyle: 60 }} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="AdminLogin" component={AdminLogin} />
        <Stack.Screen name="DriverRegister" component={DriverRegister} />
        <Stack.Screen name="UploadImages" component={UploadImages} />
        <Stack.Screen name="PassengerRegister" component={PassengerRegister} />
        <Stack.Screen name="Forget" component={Forget} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen name="Reset Password" component={ResetPassword} />
        <Stack.Screen name="Pending" component={Pending} />


        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={({ navigation }) => ({
            title: 'Admin Dashboard',
            headerStyle: {
              backgroundColor: '#2f74f5',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        />
        <Stack.Screen name="AdminHome" component={AdminHome} />
        <Stack.Screen name="AdminProfile" component={AdminProfile} />
        <Stack.Screen name="AdminFeedback" component={AdminFeedback} />
        <Stack.Screen name="DriversAuthorization" component={DriversAuthorization}
          options={{
            title: 'DriversAuthorizaiton',
            headerStyle: {
              backgroundColor:  '#2f74f5',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen name="UpdateProfile" component={UpdateProfile} />

        <Stack.Screen name="Driver_Dashboard" component={Driver_Dashboard} />
        <Stack.Screen name="DriverHome" component={DriverHome} />
        <Stack.Screen name="DriverChat" component={DriverChat} />
        <Stack.Screen name="DriverProfile" component={DriverProfile} />
        <Stack.Screen name="DriverFeedback" component={DriverFeedback} />
        <Stack.Screen name="DriverMessages" component={Messages} />
        <Stack.Screen name="Share Post" component={SharePost} />
        <Stack.Screen name="Receive Request" component={ReceiveRequest} />


        <Stack.Screen name="Passenger_Dashboard" component={Passenger_Dashboard} />
        <Stack.Screen name="PassengerHome" component={PassengerHome} />
        <Stack.Screen name="PassengerChat" component={PassengerChat} />
        <Stack.Screen name="PassengerProfile" component={PassengerProfile} />
        <Stack.Screen name="PassengerFeedback" component={PassengerFeedback} />
        <Stack.Screen name="Messages" component={Messages} />
        <Stack.Screen name="Get Ride" component={GetRide} options={{
            title: 'GetRide',
            headerStyle: {
              backgroundColor:  '#2f74f5',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
