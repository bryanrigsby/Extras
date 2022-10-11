import React, { useMemo, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

//screen
import SelectionScreen from './src/screens/SelectionScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';

//context
import { Context } from './src/context/Context';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // primary: 'tomato',
    // secondary: 'yellow',
    
  },
};

export default function App() {

  const [user, setUser] = useState('user')
  const [extras, setExtras] = useState('extras')
  const [jobs, setJobs] = useState('jobs')

  const providerValue = useMemo(() => ({ user, setUser, extras, setExtras, jobs, setJobs}), [user, setUser, extras, setExtras, jobs, setJobs])

  return (
    <Context.Provider value={providerValue}>
      <NavigationContainer>
        <PaperProvider theme={theme}>
          <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
            <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
            <Stack.Screen options={{headerShown: false}} name="Profile" component={ProfileScreen} />
            
          </Stack.Navigator>
        </PaperProvider>
      </NavigationContainer>
    </Context.Provider>
  )
}


