import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ManageJobsScreen from '../screens/ManageJobsScreen';
import JobsScreen from '../screens/JobsScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen options={{headerShown: false}} name="Splash" component={SplashScreen} />
            <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
            <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
            <Stack.Screen options={{headerShown: false}} name="Profile" component={ProfileScreen} />
            <Stack.Screen options={{headerShown: false}} name="ManageJobs" component={ManageJobsScreen} />
            <Stack.Screen options={{headerShown: false}} name="Jobs" component={JobsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default MainNavigator;