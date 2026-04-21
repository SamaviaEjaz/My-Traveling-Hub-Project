import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { DriverProvider } from './Screens/Driver Screens/DriverContext';

import AdminLogin from './Screens/Home Screens/Admin Login';
import DriverRegister from './Screens/Home Screens/DriverRegister';
import Forget from './Screens/Home Screens/Forget';
import LoginPage from './Screens/Home Screens/LoginPage';
import PassengerLogin from './Screens/Home Screens/PassengerLogin';
import OTP from './Screens/Home Screens/OTP';
import PassengerRegister from './Screens/Home Screens/PassengerRegister';
import Pending from './Screens/Home Screens/Pending';
import Register from './Screens/Home Screens/Register';
import ResetPassword from './Screens/Home Screens/Reset Password';
import UploadImages from './Screens/Home Screens/UploadImages';
import WelCome from './Screens/Home Screens/WelCome';
import Driver_OTP from './Screens/Home Screens/Driver_OTP';
import Passenger_OTP from './Screens/Home Screens/Passenger_OTP';


// Admin Dashboard Screens
import Admin_UpdateProfile from './Screens/Admin_Dashboard/Admin_Update Profile';
import AdminDashboard from './Screens/Admin_Dashboard/AdminDashboard';
import DriversAuthorization from './Screens/Admin_Dashboard/DriversAuthorization';
import Complaint from './Screens/Admin_Dashboard/Complaint';
import AdminHome from './Screens/Admin_Dashboard/Home';
import AdminProfile from './Screens/Admin_Dashboard/Profile';
import ViewRegisteredDriver from './Screens/Admin_Dashboard/View Registered Driver';

// Driver Screens
import DriverChat from './Screens/Driver Screens/ChatTemp';
import Driver_Dashboard from './Screens/Driver Screens/Driver_Dashboard';
import Driver_Name from './Screens/Driver Screens/Driver_Name';
import DriverFeedback from './Screens/Driver Screens/Feedback';
import DriverHome from './Screens/Driver Screens/Home';
import DriverProfile from './Screens/Driver Screens/Profile';
import Driver_UpdateProfile from './Screens/Driver Screens/Driver_UpdateProfile';
import ReceiveRequest from './Screens/Driver Screens/Receive Request';
import DriversReviews from './Screens/Driver Screens/DriverReviews';
import SharePost from './Screens/Driver Screens/Share Post';
import ViewSharedPost from './Screens/Driver Screens/View Shared Post';

// Passenger Screens
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
import GiveComplaint from './Screens/Passenger Screens/GiveComplaint';
import BookRide from './Screens/Passenger Screens/BookRide';


const Stack = createNativeStackNavigator();

// Common header styles for consistency
const blueHeader = {
  headerStyle: {
    backgroundColor: '#2f74f5',
  },
  headerTintColor: '#ffffff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const adminHeader = {
  headerStyle: {
    backgroundColor: '#8ca3bdf8',
  },
  headerTintColor: '#ffffff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

export default function App() {
  return (
    <DriverProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="WelCome">
          {/* Home Screens */}
          <Stack.Screen name="WelCome" component={WelCome} />
          <Stack.Screen
            name="LoginPage"
            component={LoginPage}
            options={{ title: 'Login', ...blueHeader }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ title: 'Register', ...blueHeader }}
          />
          <Stack.Screen
            name="PassengerLogin"
            component={PassengerLogin}
            options={{ title: 'Passenger Login', ...blueHeader }}
          />
          <Stack.Screen
            name="AdminLogin"
            component={AdminLogin}
            options={{ title: 'Admin Login', ...adminHeader }}
          />
          <Stack.Screen
            name="DriverRegister"
            component={DriverRegister}
            options={{ title: 'Driver Registration', ...blueHeader }}
          />
          <Stack.Screen
            name="UploadImages"
            component={UploadImages}
            options={{ title: 'Upload Images', ...blueHeader }}
          />
          <Stack.Screen
            name="PassengerRegister"
            component={PassengerRegister}
            options={{ title: 'Passenger Registration', ...blueHeader }}
          />
          <Stack.Screen
            name="Forget"
            component={Forget}
            options={{ title: 'Forgot Password', ...blueHeader }}
          />
          <Stack.Screen
            name="OTP"
            component={OTP}
            options={{ title: 'OTP Verification', ...blueHeader }}
          />
          <Stack.Screen
            name="Driver_OTP"
            component={Driver_OTP}
            options={{ title: 'Driver_OTP', ...blueHeader }}
          />
          <Stack.Screen
            name="Passenger_OTP"
            component={Driver_OTP}
            options={{ title: 'Passenger_OTP', ...blueHeader }}
          />
          <Stack.Screen
            name="Reset Password"
            component={ResetPassword}
            options={{ title: 'Reset Password', ...blueHeader }}
          />
          <Stack.Screen
            name="Pending"
            component={Pending}
            options={{ title: 'Pending Approval', ...blueHeader }}
          />

          {/* Admin Dashboard Screens */}
          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboard}
            options={{ title: 'Admin Dashboard', ...blueHeader }}
          />
          <Stack.Screen
            name="AdminHome"
            component={AdminHome}
            options={{ title: 'Admin Home', ...blueHeader }}
          />
          <Stack.Screen
            name="AdminProfile"
            component={AdminProfile}
            options={{ title: 'Admin Profile', ...blueHeader }}
          />
          <Stack.Screen
            name="Complaint"
            component={Complaint}
            options={{ title: 'Complaints', ...blueHeader }}
          />
          <Stack.Screen
            name="DriversAuthorization"
            component={DriversAuthorization}
            options={{ title: 'Driver Authorization', ...blueHeader }}
          />
          <Stack.Screen
            name="View Registered Driver"
            component={ViewRegisteredDriver}
            options={{ title: 'Registered Drivers', ...blueHeader }}
          />
          <Stack.Screen
            name="Admin_UpdateProfile"
            component={Admin_UpdateProfile}
            options={{ title: 'Update Profile', ...blueHeader }}
          />

          {/* Driver Screens */}
          <Stack.Screen
            name="Driver_Dashboard"
            component={Driver_Dashboard}
            options={{ title: 'Driver Dashboard', ...blueHeader }}
          />
          <Stack.Screen
            name="Driver_Name"
            component={Driver_Name}
            options={{ title: 'Driver Name', ...blueHeader }}
          />
          <Stack.Screen
            name="DriverHome"
            component={DriverHome}
            options={{ title: 'Driver Home', ...blueHeader }}
          />
          <Stack.Screen
            name="DriverChat"
            component={DriverChat}
            options={{ title: 'Driver Chat', ...blueHeader }}
          />
          <Stack.Screen
            name="DriversReviews"
            component={DriversReviews}
            options={{ title: 'DriverReviews', ...blueHeader }}
          />
          <Stack.Screen
            name="DriverProfile"
            component={DriverProfile}
            options={{ title: 'Driver Profile', ...blueHeader }}
          />
          <Stack.Screen
            name="Driver_UpdateProfile"
            component={Driver_UpdateProfile}
            options={{ title: 'Update Profile', ...blueHeader }}
          />
          <Stack.Screen
            name="DriverFeedback"
            component={DriverFeedback}
            options={{ title: 'Driver Feedback', ...blueHeader }}
          />
          <Stack.Screen
            name="Share Post"
            component={SharePost}
            options={{ title: 'Share Post', ...blueHeader }}
          />
          <Stack.Screen
            name="ViewSharedPost"
            component={ViewSharedPost}
            options={{ title: 'View Shared Posts', ...blueHeader }}
          />
          <Stack.Screen
            name="Receive Request"
            component={ReceiveRequest}
            options={{ title: 'Receive Request', ...blueHeader }}
          />

          {/* Passenger Screens */}
          <Stack.Screen
            name="Passenger_Dashboard"
            component={Passenger_Dashboard}
            options={{ title: 'Passenger Dashboard', ...blueHeader }}
          />
          <Stack.Screen
            name="PassengerHome"
            component={PassengerHome}
            options={{ title: 'Passenger Home', ...blueHeader }}
          />
          <Stack.Screen
            name="PassengerChat"
            component={PassengerChat}
            options={{ title: 'Passenger Chat', ...blueHeader }}
          />
          <Stack.Screen
            name="PassengerMessages"
            component={PassengerMessages}
            options={{ title: 'Passenger Messages', ...blueHeader }}
          />
          <Stack.Screen
            name="PassengerProfile"
            component={PassengerProfile}
            options={{ title: 'Passenger Profile', ...blueHeader }}
          />
          <Stack.Screen
            name="Passenger_UpdateProfile"
            component={Passenger_UpdateProfile}
            options={{ title: 'Update Profile', ...blueHeader }}
          />
          <Stack.Screen
            name="PassengerFeedback"
            component={PassengerFeedback}
            options={{ title: 'Passenger Feedback', ...blueHeader }}
          />
          <Stack.Screen
            name="GiveComplaint"
            component={GiveComplaint}
            options={{ title: 'File Complaint', ...blueHeader }}
          />
          <Stack.Screen
            name="Reviews"
            component={PassengersReviews}   // ← review DENE wali screen
            options={{ title: 'Give Review', ...blueHeader }}
          />
          <Stack.Screen
            name="BookRide"
            component={ViewBookingStatus}
            options={{ title: 'BookRide', ...blueHeader }}
          />
          <Stack.Screen
            name="Messages"
            component={Messages}
            options={{ title: 'Messages', ...blueHeader }}
          />
          <Stack.Screen
            name="Get Ride"
            component={GetRide}
            options={{ title: 'Get a Ride', ...blueHeader }}
          />
          <Stack.Screen
            name="View Booking Status"
            component={ViewBookingStatus}
            options={{ title: 'Booking Status', ...blueHeader }}
          />
          {/* <Stack.Screen 
            name="Reviews" 
            component={PassengersReviews} 
            options={{ title: 'Passenger Reviews', ...blueHeader }} 
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </DriverProvider>
  );
}