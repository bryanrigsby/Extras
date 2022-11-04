import React, { useMemo, useState, useEffect } from 'react'
import { View, Text } from 'react-native'

import { CurrentRenderContext, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { getAuth, onAuthStateChanged } from "firebase/auth";


//screen
import SelectionScreen from './src/screens/SelectionScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';

//context
import { Context } from './src/context/Context';
import { getAsyncStorage, getUserFromDB, getUserStatus } from './src/util';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // primary: 'tomato',
    // secondary: 'yellow',
    
  },
};

const App = () => {

  const [isExtra, setIsExtra] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState('user')
  const [extras, setExtras] = useState([])
  const [jobs, setJobs] = useState([])

  const providerValue = useMemo(() => ({ user, setUser, extras, setExtras, jobs, setJobs}), [user, setUser, extras, setExtras, jobs, setJobs])

  const auth = getAuth();

  const getUser = async () => {
    onAuthStateChanged(auth, (user) => {
        let loggedIn = false
        if (user) {
            // console.log('user', user)
            loggedIn = true;
        } else {
            loggedIn = false
        }
        setLoggedIn(loggedIn)
    });
    const response = await getAsyncStorage('@user')
    console.log('asyncStorage response', response)
    if(response){
      setIsExtra(response.isExtra)
      let result = await getUserFromDB(response.uid)
      // console.log('result', result.user)
      setUser(result.user)
      if(result.extras){
        setExtras(result.extras)
      }
      else{
        setJobs(result.jobs)
      }
    }
    return null
  }

  useEffect(() => {
    getUser()
  }, [])
  

  return (
    <Context.Provider value={providerValue}>
      <NavigationContainer>
        <PaperProvider theme={theme}>
          <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} initialParams={{isExtra: isExtra}} />
            <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
            <Stack.Screen options={{headerShown: false}} name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </PaperProvider>
      </NavigationContainer>
    </Context.Provider>
  )
}

export default App 
