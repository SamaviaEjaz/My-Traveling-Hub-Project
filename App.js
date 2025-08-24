import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';



import Admin_UpdateProfile from './Screens/Admin_Dashboard/Admin_Update Profile';
import AdminDashboard from './Screens/Admin_Dashboard/AdminDashboard';
import DriversAuthorization from './Screens/Admin_Dashboard/DriversAuthorization';
import Complaint from './Screens/Admin_Dashboard/Complaint';
import AdminHome from './Screens/Admin_Dashboard/Home';
import AdminProfile from './Screens/Admin_Dashboard/Profile';
import ViewRegisteredDriver from './Screens/Admin_Dashboard/View Registered Driver';

import DriverChat from './Screens/Driver Screens/ChatTemp';
import DriverMessages from './Screens/Driver Screens/Messages';
import Driver_Dashboard from './Screens/Driver Screens/Driver_Dashboard';
import DriverFeedback from './Screens/Driver Screens/Feedback';
import DriverHome from './Screens/Driver Screens/Home';
import DriverProfile from './Screens/Driver Screens/Profile';
import Driver_UpdateProfile from './Screens/Driver Screens/Driver_UpdateProfile';
import ReceiveRequest from './Screens/Driver Screens/Receive Request';
import DriversReviews from './Screens/Driver Screens/Reviews';
import SharePost from './Screens/Driver Screens/Share Post';
import ViewSharedPost from './Screens/Driver Screens/View Shared Post';

import PassengerChat from './Screens/Passenger Screens/ChatTemp';
import PassengerMessages from './Screens/Passenger Screens/Messages';
import PassengerFeedback from './Screens/Passenger Screens/Feedback';
import GetRide from './Screens/Passenger Screens/Get Ride';
import PassengerHome from './Screens/Passenger Screens/Home';
import Messages from './Screens/Passenger Screens/Messages';
import Passenger_Dashboard from './Screens/Passenger Screens/Passenger_Dashboard';
import Passenger_UpdateProfile from './Screens/Passenger Screens/Passenger_UpdateProfile';
import PassengerProfile from './Screens/Passenger Screens/Profile';
import PassengersReviews from './Screens/Passenger Screens/Reviews';
import ViewBookingStatus from './Screens/Passenger Screens/View Booking Status';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelCome">


        <Stack.Screen name="WelCome" component={WelCome} />
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ title: 'LoginPage', headerStyle: 60 }} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="AdminLogin" component={AdminLogin} 
         options={({ navigation }) => ({
            title: 'AdminLogin',
            headerStyle: {
              backgroundColor: '#8ca3bdf8',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })} />
        <Stack.Screen name="DriverRegister" component={DriverRegister}
          options={({ navigation }) => ({
            title: 'DriverRegister',
            headerStyle: {
              backgroundColor: '#2f74f5',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })} />
        <Stack.Screen name="UploadImages" component={UploadImages}
          options={({ navigation }) => ({
            title: 'UploadImages',
            headerStyle: {
              backgroundColor: '#2f74f5',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })} />
        <Stack.Screen name="PassengerRegister" component={PassengerRegister}
          options={({ navigation }) => ({
            title: 'PassengerRegister',
            headerStyle: {
              backgroundColor: '#2f74f5',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })} />
        <Stack.Screen name="Forget" component={Forget} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen name="Reset Password" component={ResetPassword} />
        <Stack.Screen name="Pending" component={Pending} />

       


        <Stack.Screen name="Driver_Dashboard" component={Driver_Dashboard} />
        <Stack.Screen name="DriverHome" component={DriverHome} />
        <Stack.Screen name="DriverChat" component={DriverChat} />
        <Stack.Screen name="DriverMessages" component={DriverMessages} />
        <Stack.Screen name="DriversReviews" component={DriversReviews} />
        <Stack.Screen name="DriverProfile" component={Driver_UpdateProfile} />
        <Stack.Screen name="Driver_UpdateProfile" component={Driver_UpdateProfile} />
        <Stack.Screen name="DriverFeedback" component={DriverFeedback} />
        <Stack.Screen name="Share Post" component={SharePost} />
        <Stack.Screen name="ViewSharedPost" component={ViewSharedPost} />
        <Stack.Screen name="Receive Request" component={ReceiveRequest} />


        <Stack.Screen name="Passenger_Dashboard" component={Passenger_Dashboard}
          options={{
            title: 'Passenger_Dashboard',
            headerStyle: {
              backgroundColor: '#2f74f5',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="PassengerHome" component={PassengerHome}
          options={{
            title: 'PassengerHome',
            headerStyle: {
              backgroundColor: '#2f74f5',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />
        <Stack.Screen name="PassengerChat" component={PassengerChat} />
        <Stack.Screen name="PassengerMessages" component={PassengerMessages} />
        <Stack.Screen name="PassengerProfile" component={PassengerProfile} />
        <Stack.Screen name="Passenger_UpdateProfile" component={Passenger_UpdateProfile} />
        <Stack.Screen name="PassengerFeedback" component={PassengerFeedback} />
        <Stack.Screen name="Messages" component={Messages}
          options={{
            title: 'Messages',
            headerStyle: {
              backgroundColor: '#2f74f5',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />

        <Stack.Screen name="Get Ride" component={GetRide} options={{
          title: 'GetRide',
          headerStyle: {
            backgroundColor: '#2f74f5',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        />
        <Stack.Screen name="View Booking Status" component={ViewBookingStatus} />
        <Stack.Screen name="Reviews" component={PassengersReviews}
          options={{
            title: 'Reviews',
            headerStyle: {
              backgroundColor: '#2f74f5',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
