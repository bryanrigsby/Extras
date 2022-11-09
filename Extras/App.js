import React, { useMemo, useState } from 'react'
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Context } from './src/context/Context';
import MainNavigator from './src/navigation/MainNavigation';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // primary: 'tomato',
    // secondary: 'yellow',
    
  },
};

const App = () => {

  
  const [user, setUser] = useState('user')
  const [extras, setExtras] = useState([])
  const [jobs, setJobs] = useState([])

  const providerValue = useMemo(() => ({ user, setUser, extras, setExtras, jobs, setJobs}), [user, setUser, extras, setExtras, jobs, setJobs])



  return (
    <Context.Provider value={providerValue}>
      <PaperProvider theme={theme}>
        <MainNavigator />
      </PaperProvider>
    </Context.Provider>
  )
}

export default App 
